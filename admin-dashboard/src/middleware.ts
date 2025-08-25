import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public pages that don't require authentication
const publicPages = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/otp-verification",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next.js internal paths and public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/logo")
  ) {
    return NextResponse.next();
  }

  // Allow public pages
  if (publicPages.some((page) => pathname.startsWith(page))) {
    return NextResponse.next();
  }

  // Read the token from cookies
  const token = req.cookies.get("token")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
