import { withAuth } from "next-auth/middleware"

// This is the directory users will be redirected to if they attempt to access private routes.
export default withAuth({
  pages: {
    signIn: "/login",
  }
})

// These are private routes that only logged in users can access.
export const config = {
  matcher: [
    "/recruit/:path*",
    "/saved/:path*",
  ]
}