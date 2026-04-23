import { NextRequest, NextResponse } from "next/server";
import { TENANT_COOKIE_NAME, readSession } from "@/lib/auth";

const PUBLIC_PATHS = new Set(["/", "/login"]);

// Reserved top-level segments that used to be flat routes; now nested under /[company]/.
const RESERVED_SUBROUTES = new Set([
  "discovery",
  "companies",
  "analytics",
  "settings",
  "help",
]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  if (!firstSegment) return NextResponse.next();

  const cookieValue = req.cookies.get(TENANT_COOKIE_NAME)?.value;
  const session = await readSession(cookieValue);

  // Legacy flat URLs: /analytics, /discovery, etc. — redirect to /{tenant}/{slug}.
  if (RESERVED_SUBROUTES.has(firstSegment)) {
    const url = req.nextUrl.clone();
    if (session) {
      url.pathname = `/${session.tenant}/${firstSegment}`;
      return NextResponse.redirect(url);
    }
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Otherwise treat the first segment as a company slug.
  if (!session || session.tenant !== firstSegment) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|api/).*)",
  ],
};
