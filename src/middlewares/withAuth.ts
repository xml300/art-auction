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
      process.env.JWT_SECRET_KEY || "your_jwt_secret"
    );
    const { payload } = await jwtVerify(token, secret);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

const PROTECTED_PREFIXES = ["/dashboard", "/artist-dashboard"];

export const withAuth: MiddlewareFactory = (next: NextMiddlewareHandler) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { pathname } = request.nextUrl;
    const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    if (!isProtected) {
      return next(request, event);
    }

    const authCookie = request.cookies.get("auth")?.value;
    const redirectUrl = new URL("/auth", process.env.SITE_BASE_URL || request.url);

    if (!authCookie) {
      return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    const payload = await verifyJwtPayload(authCookie);
    if (!payload) {
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

    const mutatedRequest = new NextRequest(request, {
      headers: requestHeaders,
    });

    return next(mutatedRequest, event);
  };
};
