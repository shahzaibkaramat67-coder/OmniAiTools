export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tools/:path*",
    "/history/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/api/generate/:path*",
    "/api/history/:path*",
    "/api/user/:path*",
    "/api/admin/:path*",
  ],
};
