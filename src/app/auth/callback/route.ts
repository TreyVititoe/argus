import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { tenantForEmail } from "@/lib/auth";

// Supabase magic-link callback. Exchanges the code in the URL for a session,
// then routes the user to their tenant dashboard (or rejects them if their
// email's domain isn't in our tenant map).
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    const url = new URL("/login?error=missing_code", origin);
    return NextResponse.redirect(url);
  }

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user?.email) {
    const url = new URL("/login?error=invalid_link", origin);
    return NextResponse.redirect(url);
  }

  const tenant = tenantForEmail(data.user.email);
  if (!tenant) {
    // Allowed-domain check after Supabase confirmed the user. Sign them out
    // so they don't sit in a session with no tenant.
    await supabase.auth.signOut();
    const url = new URL("/login?error=domain_not_allowed", origin);
    return NextResponse.redirect(url);
  }

  const url = new URL(next && next.startsWith("/") ? next : `/${tenant}`, origin);
  return NextResponse.redirect(url);
}
