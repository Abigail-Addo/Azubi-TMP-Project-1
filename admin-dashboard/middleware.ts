import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define routes that require authentication
const protectedRoutes = [
  "/tracks",
  "/dashboard",
  "/some-other-protected-route",
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // adjust 'token' to your cookie key
  const { pathname } = req.nextUrl;

  // If route is protected and token is missing, redirect to login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise continue
  return NextResponse.next();
}

// Apply middleware to all paths
export const config = {
  matcher: ["/((?!login|signup|_next|favicon.ico).*)"],
};
