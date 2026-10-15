import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory, NextMiddlewareHandler } from "./types";
import { Roles } from "@/enums";

export const withRole: MiddlewareFactory = (next: NextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { pathname } = request.nextUrl;
    const roleHeader = request.headers.get("x-user-role");

    if (roleHeader !== null) {
      const roleId = Number(roleHeader);

      // Protect admin routes and admin APIs from non-admins
      if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        if (roleId !== Roles.Admin) {
          if (pathname.startsWith("/api/")) {
            return NextResponse.json(
              { success: false, error: "Access denied. Administrator privileges required." },
              { status: 403 }
            );
          }
          const redirectPath = roleId === Roles.Artist ? "/artist-dashboard" : "/dashboard";
          const redirectUrl = new URL(redirectPath, process.env.SITE_BASE_URL || request.url);
          return NextResponse.redirect(redirectUrl, { status: 303 });
        }
      }

      // Protect artist dashboard from non-artists
      if (pathname.startsWith("/artist-dashboard") && roleId !== Roles.Artist) {
        const redirectPath = roleId === Roles.Admin ? "/admin" : "/dashboard";
        const redirectUrl = new URL(redirectPath, process.env.SITE_BASE_URL || request.url);
        return NextResponse.redirect(redirectUrl, { status: 303 });
      }

      // Redirect artists or admins attempting to access collector dashboard to their own dashboard
      if (pathname.startsWith("/dashboard")) {
        if (roleId === Roles.Artist) {
          const redirectUrl = new URL("/artist-dashboard", process.env.SITE_BASE_URL || request.url);
          return NextResponse.redirect(redirectUrl, { status: 303 });
        }
        if (roleId === Roles.Admin) {
          const redirectUrl = new URL("/admin", process.env.SITE_BASE_URL || request.url);
          return NextResponse.redirect(redirectUrl, { status: 303 });
        }
      }
    }

    return next(request, event);
  };
};
