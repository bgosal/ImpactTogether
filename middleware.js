import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { token } = req.nextauth;

    const path = req.nextUrl.pathname;

    if ((path.startsWith("/account-management") || path.startsWith("/saved")) && token?.role !== "volunteer") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if ((path.startsWith("/organization-management") || path.startsWith("/recruit")) && token?.role !== "organizer") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

// These are private routes that only logged in users can access.
export const config = {
  matcher: [
    "/recruit/:path*",
    "/saved/:path*",
    "/account-management/:path*",
    "/organization-management/:path*",
    "/create-event/:path*",
  ],
};


