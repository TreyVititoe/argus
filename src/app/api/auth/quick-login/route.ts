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

  // generateLink upserts the user (creates if missing, no-op if present)
  // and returns a magic-link URL with an embedded verification token.
  // We pull the token out and hand it back to the client so it can call
  // verifyOtp directly — no email is actually sent.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (error || !data?.properties?.action_link) {
    console.error("generateLink failed:", error);
    return NextResponse.json(
      { error: error?.message || "Couldn't generate session" },
      { status: 500 }
    );
  }

  const linkUrl = new URL(data.properties.action_link);
  const tokenHash = linkUrl.searchParams.get("token");
  if (!tokenHash) {
    return NextResponse.json(
      { error: "Invalid action link" },
      { status: 500 }
    );
  }

  return NextResponse.json({ token_hash: tokenHash, tenant });
}
