import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory, NextMiddlewareHandler } from "./types";
import { Roles } from "@/enums";

export const withRole: MiddlewareFactory = (next: NextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { pathname } = request.nextUrl;
    const roleHeader = request.headers.get("x-user-role");

    if (roleHeader !== null) {
      const roleId = Number(roleHeader);

      // Protect artist dashboard from non-artists
      if (pathname.startsWith("/artist-dashboard") && roleId !== Roles.Artist) {
        const redirectUrl = new URL("/dashboard", process.env.SITE_BASE_URL || request.url);
        return NextResponse.redirect(redirectUrl, { status: 303 });
      }

      // Redirect artists attempting to access collector dashboard to artist dashboard
      if (pathname.startsWith("/dashboard") && roleId === Roles.Artist) {
        const redirectUrl = new URL("/artist-dashboard", process.env.SITE_BASE_URL || request.url);
        return NextResponse.redirect(redirectUrl, { status: 303 });
      }
    }

    return next(request, event);
  };
};
