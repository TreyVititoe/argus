import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { tenantForEmail } from "@/lib/auth";

// Domain-trust sign-in: as long as the email is in an allowed domain we
// mint a real Supabase session for it (creating the user on first sign-in)
// and hand the verification token back to the client.
//
// This skips the email OTP step entirely. The tradeoff: anyone who knows
// or guesses an allowed-domain email can sign in. Acceptable for the MVP
// since the data is competitive intel, not PII, and the alternative —
// shipping OTP — was being filtered by Cohesity's mail security so users
// couldn't sign in at all.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: NextRequest) {
  if (!serviceKey) {
    return NextResponse.json(
      { error: "Server is missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 503 }
    );
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const tenant = tenantForEmail(email);
  if (!tenant) {
    return NextResponse.json(
      { error: "That email isn't tied to an Argus account yet. Use your work email." },
      { status: 403 }
    );
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // First-time sign-in path: create the user if they don't exist with
  // email already confirmed, so generateLink({type:'magiclink'}) can
  // produce a valid session token instead of erroring on an unknown
  // email. createUser is idempotent enough — we ignore "already exists".
  const { error: createErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (createErr && !/already (been )?registered|already exists/i.test(createErr.message)) {
    console.error("createUser failed:", createErr);
    return NextResponse.json(
      { error: createErr.message || "Couldn't create user" },
      { status: 500 }
    );
  }

  // generateLink returns hashed_token directly. The earlier version
  // pulled `?token=` out of the action_link URL, which has a `pkce_`
  // prefix verifyOtp rejects with "Email link is invalid or has expired".
  const { data, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkErr || !data?.properties?.hashed_token) {
    console.error("generateLink failed:", linkErr);
    return NextResponse.json(
      { error: linkErr?.message || "Couldn't generate session" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    token_hash: data.properties.hashed_token,
    tenant,
  });
}
