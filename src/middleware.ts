import { chainMiddlewares } from "@/middlewares/chain";
import { withLogging } from "@/middlewares/withLogging";
import { withSecurityHeaders } from "@/middlewares/withSecurityHeaders";
import { withAuth } from "@/middlewares/withAuth";
import { withRole } from "@/middlewares/withRole";

export default chainMiddlewares([
  withLogging,
  withSecurityHeaders,
  withAuth,
  withRole,
]);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/artist-dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/profile/:path*",
    "/api/bid/:path*",
    "/api/deposit/:path*",
    "/api/transactions/:path*",
    "/api/notifications/:path*",
    "/api/auth/me",
    "/api/audit-logs/:path*",
    "/api/audit-logs",
    "/api/artworks/:id/bid",
  ],
};
