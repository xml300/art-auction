import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { MiddlewareFactory, NextMiddlewareHandler } from "./types";

interface TokenPayload {
  userId?: number;
  roleId?: number;
  username?: string;
  exp?: number;
}

async function verifyJwtPayload(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET_KEY || "artsyl_secure_default_secret_key_change_in_prod"
    );
    const { payload } = await jwtVerify(token, secret);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

const PROTECTED_PAGE_PREFIXES = ["/dashboard", "/artist-dashboard"];
const PROTECTED_API_PREFIXES = [
  "/api/profile",
  "/api/bid",
  "/api/deposit",
  "/api/transactions",
  "/api/notifications",
  "/api/auth/me",
];

export const withAuth: MiddlewareFactory = (next: NextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { pathname } = request.nextUrl;
    const isProtectedPage = PROTECTED_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    const isProtectedApi = PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    if (!isProtectedPage && !isProtectedApi) {
      return next(request, event);
    }

    const authCookie = request.cookies.get("auth")?.value;

    if (!authCookie) {
      if (isProtectedApi) {
        return NextResponse.json(
          { success: false, error: "Authentication required", code: "UNAUTHORIZED" },
          { status: 401 }
        );
      }
      const redirectUrl = new URL("/auth", process.env.SITE_BASE_URL || request.url);
      return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    const payload = await verifyJwtPayload(authCookie);
    if (!payload) {
      if (isProtectedApi) {
        const response = NextResponse.json(
          { success: false, error: "Session expired or invalid", code: "TOKEN_EXPIRED" },
          { status: 401 }
        );
        response.cookies.delete("auth");
        return response;
      }
      const redirectUrl = new URL("/auth", process.env.SITE_BASE_URL || request.url);
      const response = NextResponse.redirect(redirectUrl, { status: 303 });
      response.cookies.delete("auth");
      return response;
    }

    // Clone request headers to forward user info downstream
    const requestHeaders = new Headers(request.headers);
    if (payload.userId) {
      requestHeaders.set("x-user-id", String(payload.userId));
    }
    if (payload.roleId !== undefined) {
      requestHeaders.set("x-user-role", String(payload.roleId));
    }
    if (payload.username) {
      requestHeaders.set("x-username", payload.username);
    }

    const mutatedRequest = new NextRequest(request, {
      headers: requestHeaders,
    });

    return next(mutatedRequest, event);
  };
};
