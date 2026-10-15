import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
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

const accessSecretKey = new TextEncoder().encode(JWT_SECRET);
const refreshSecretKey = new TextEncoder().encode(JWT_REFRESH_SECRET);

export const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes (in seconds)
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days (in seconds)

export async function signAccessToken(payload: Omit<SessionPayload, "tokenType" | "iat" | "exp">): Promise<string> {
    return await new SignJWT({ ...payload, tokenType: "access" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${ACCESS_TOKEN_MAX_AGE}s`)
        .sign(accessSecretKey);
}

export async function signRefreshToken(payload: Omit<SessionPayload, "tokenType" | "iat" | "exp">): Promise<string> {
    return await new SignJWT({
        userId: payload.userId,
        roleId: payload.roleId,
        username: payload.username,
        tokenType: "refresh",
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${REFRESH_TOKEN_MAX_AGE}s`)
        .sign(refreshSecretKey);
}

export async function verifyAccessToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, accessSecretKey, {
            algorithms: ["HS256"],
        });
        if (payload.tokenType !== "access") return null;
        return payload as unknown as SessionPayload;
    } catch {
        return null;
    }
}

export async function verifyRefreshToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, refreshSecretKey, {
            algorithms: ["HS256"],
        });
        if (payload.tokenType !== "refresh") return null;
        return payload as unknown as SessionPayload;
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
            path: "/api",
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
        path: "/api",
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
    // Fast path: check if Next.js middleware already verified this request
    try {
        const headerList = await headers();
        const isVerified = headerList.get("x-auth-verified") === "true";
        const userIdStr = headerList.get("x-user-id");
        const roleIdStr = headerList.get("x-user-role");
        const username = headerList.get("x-username");

        // NO defaults for roleId or username: all must be valid and present
        if (isVerified && userIdStr && roleIdStr && username) {
            const userId = Number(userIdStr);
            const roleId = Number(roleIdStr);
            if (!Number.isNaN(userId) && !Number.isNaN(roleId)) {
                return [
                    {
                        userId,
                        roleId,
                        username,
                        tokenType: "access",
                    },
                    null,
                ];
            }
        }
    } catch {
        // Fallback if headers() cannot be called
    }

    // Fallback: Verify access token directly from cookie
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth")?.value || "";

    if (!authCookie) {
        return [null, "User unauthorized"];
    }

    const payload = await verifyAccessToken(authCookie);
    if (!payload) {
        return [null, "Token is invalid or expired"];
    }

    return [payload, null];
}
