import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isAuth = !!token;

  const protectedRoutes = ["/", "/courses", "/tracks", "/tracks/track-details"];

  const currentPath = req.nextUrl.pathname;

  if (protectedRoutes.includes(currentPath) && !isAuth) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware to these routes
export const config = {
  matcher: ["/", "/courses", "/tracks", "/tracks/track-details"], // Match only protected routes
};
