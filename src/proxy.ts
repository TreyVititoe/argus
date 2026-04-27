import { NextRequest, NextResponse } from "next/server";
import { getSupabaseProxy } from "@/lib/supabase/middleware";
import { tenantForEmail } from "@/lib/auth";

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/pricing",
  "/about",
  "/security",
  "/privacy",
  "/terms",
  "/dpa",
  "/subprocessors",
  "/aup",
  "/sla",
  "/status",
  "/faq",
  "/why-argus",
  "/for-sales-leaders",
  "/for-reps",
  "/opengraph-image",
]);

// Reserved top-level segments that used to be flat routes; now nested under /[company]/.
const RESERVED_SUBROUTES = new Set([
  "discovery",
  "companies",
  "analytics",
  "settings",
  "help",
  "glossary",
]);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Static assets in /public/* (anything with a file extension in the last segment).
  const lastSegment = pathname.split("/").pop() ?? "";
  if (lastSegment.includes(".")) {
    return NextResponse.next();
  }

  // Always run Supabase so tokens refresh via response cookies.
  const { user, response } = await getSupabaseProxy(req);
  const tenant = user?.email ? tenantForEmail(user.email) : null;

  if (PUBLIC_PATHS.has(pathname)) {
    return response;
  }

  // /auth/* (callback, etc.) — let Supabase handle, no gate.
  if (pathname.startsWith("/auth/")) {
    return response;
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  if (!firstSegment) return response;

  // Legacy flat URLs: /analytics, /discovery, etc. → /{tenant}/{slug} or /login.
  if (RESERVED_SUBROUTES.has(firstSegment)) {
    const url = req.nextUrl.clone();
    if (tenant) {
      url.pathname = `/${tenant}/${firstSegment}`;
      return NextResponse.redirect(url);
    }
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Otherwise the first segment is a company slug — must match the user's tenant.
  if (!tenant || tenant !== firstSegment) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|api/).*)",
  ],
};
