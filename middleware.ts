import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    const isManager = token?.role === "MANAGER";

    // Admin routes - only ADMIN can access
    if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Manager routes - only MANAGER and ADMIN can access
    if (req.nextUrl.pathname.startsWith("/manager") && !isManager && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/manager/:path*", "/dashboard/:path*"],
};