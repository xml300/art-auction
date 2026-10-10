import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export interface SessionPayload {
    userId: number;
    roleId: number; 
    username: string;
    profilePicture?: string | null;
    tokenType?: "access" | "refresh";
    iat?: number;
    exp?: number;
}

export type Payload = SessionPayload;

const JWT_SECRET = process.env.JWT_SECRET_KEY || "artsyl_secure_default_secret_key_change_in_prod";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET_KEY || `${JWT_SECRET}_refresh_key`;

export const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes (in seconds)
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days (in seconds)

export function signAccessToken(payload: Omit<SessionPayload, "tokenType" | "iat" | "exp">): string {
    return jwt.sign(
        { ...payload, tokenType: "access" },
        JWT_SECRET,
        { expiresIn: `${ACCESS_TOKEN_MAX_AGE}s` }
    );
}

export function signRefreshToken(payload: Omit<SessionPayload, "tokenType" | "iat" | "exp">): string {
    return jwt.sign(
        { userId: payload.userId, roleId: payload.roleId, username: payload.username, tokenType: "refresh" },
        JWT_REFRESH_SECRET,
        { expiresIn: `${REFRESH_TOKEN_MAX_AGE}s` }
    );
}

export function verifyAccessToken(token: string): SessionPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as SessionPayload;
        if (decoded.tokenType && decoded.tokenType !== "access") return null;
        return decoded;
    } catch {
        return null;
    }
}

export function verifyRefreshToken(token: string): SessionPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as SessionPayload;
        if (decoded.tokenType && decoded.tokenType !== "refresh") return null;
        return decoded;
    } catch {
        return null;
    }
}

export function setAuthCookies(
    response: NextResponse,
    accessToken: string,
    refreshToken?: string
) {
    const isProd = process.env.NODE_ENV === "production";

    response.cookies.set("auth", accessToken, {
        maxAge: ACCESS_TOKEN_MAX_AGE,
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
    });

    if (refreshToken) {
        response.cookies.set("refreshToken", refreshToken, {
            maxAge: REFRESH_TOKEN_MAX_AGE,
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            path: "/",
        });
    }
}

export function clearAuthCookies(response: NextResponse) {
    const isProd = process.env.NODE_ENV === "production";
    response.cookies.set("auth", "", {
        maxAge: 0,
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
    });
    response.cookies.set("refreshToken", "", {
        maxAge: 0,
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
    });
}

export async function getSession(): Promise<[ SessionPayload | null, string | null]> {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth")?.value || "";

    if (!authCookie) {
        return [null, "User unauthorized"];
    }

    const payload = verifyAccessToken(authCookie);
    if (!payload) {
        return [null, "Token is invalid or expired"];
    }

    return [payload, null];
}
