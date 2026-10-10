import { NextFetchEvent, NextRequest } from "next/server";
import { MiddlewareFactory, NextMiddlewareHandler } from "./types";

export const withSecurityHeaders: MiddlewareFactory = (next: NextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = await next(request, event);

    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );

    return response;
  };
};
