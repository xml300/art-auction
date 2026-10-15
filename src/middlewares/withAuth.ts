import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { MiddlewareFactory, NextMiddlewareHandler } from "./types";

interface TokenPayload {
  userId?: number;
  roleId?: number;
  username?: string;
  tokenType?: string;
  exp?: number;
}

async function verifyJwtPayload(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET_KEY || "artsyl_secure_default_secret_key_change_in_prod"
    );
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    if (payload.tokenType !== "access") {
      return null;
    }
    return payload as unknown as TokenPayload;
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
  "/api/audit-logs",
];

export const withAuth: MiddlewareFactory = (next: NextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // Strip client-supplied headers to prevent spoofing
    const requestHeaders = new Headers(request.headers);
    requestHeaders.delete("x-user-id");
    requestHeaders.delete("x-user-role");
    requestHeaders.delete("x-username");
    requestHeaders.delete("x-auth-verified");

    const { pathname } = request.nextUrl;
    const isProtectedPage = PROTECTED_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    const isProtectedApi =
      PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
      /^\/api\/artworks\/[^/]+\/bid/.test(pathname);

    if (!isProtectedPage && !isProtectedApi) {
      return next(new NextRequest(request, { headers: requestHeaders }), event);
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

    // Set verified headers downstream only when all required properties exist (no dummy defaults)
    if (payload.userId !== undefined && payload.roleId !== undefined && payload.username) {
      requestHeaders.set("x-user-id", String(payload.userId));
      requestHeaders.set("x-user-role", String(payload.roleId));
      requestHeaders.set("x-username", payload.username);
      requestHeaders.set("x-auth-verified", "true");
    }

    const mutatedRequest = new NextRequest(request, {
      headers: requestHeaders,
    });

    return next(mutatedRequest, event);
  };
};
