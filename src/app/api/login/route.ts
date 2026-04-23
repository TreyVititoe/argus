import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_MAX_AGE_SECONDS,
  TENANT_COOKIE_NAME,
  signSession,
  tenantForEmail,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!process.env.AUTH_SECRET) {
    return NextResponse.json(
      { error: "Login is not configured on this server" },
      { status: 503 }
    );
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const rawEmail = (body.email ?? "").trim();
  if (!rawEmail) {
    return NextResponse.json({ error: "Enter your work email" }, { status: 400 });
  }

  const email = rawEmail.toLowerCase();
  const tenant = tenantForEmail(email);
  if (!tenant) {
    return NextResponse.json(
      { error: "This email isn't tied to an Argus account yet. Use your company email to continue." },
      { status: 403 }
    );
  }

  const signed = await signSession({ tenant, email });
  const res = NextResponse.json({ tenant });
  res.cookies.set({
    name: TENANT_COOKIE_NAME,
    value: signed,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  return res;
}
