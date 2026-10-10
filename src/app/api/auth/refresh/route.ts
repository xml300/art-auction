import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/auth";
import { getUser } from "@/data/queries";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, error: "Refresh token missing", code: "NO_REFRESH_TOKEN" },
      { status: 401 }
    );
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    const response = NextResponse.json(
      { success: false, error: "Invalid or expired refresh token", code: "INVALID_REFRESH_TOKEN" },
      { status: 401 }
    );
    clearAuthCookies(response);
    return response;
  }

  try {
    // Verify user still exists in database
    const user = await getUser(payload.userId);
    if (!user) {
      const response = NextResponse.json(
        { success: false, error: "User no longer exists", code: "USER_NOT_FOUND" },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    // Issue refreshed token pair (Refresh Token Rotation)
    const newAccessToken = signAccessToken({
      userId: user.id,
      roleId: user.roleId,
      username: user.username,
      profilePicture: user.profilePicture,
    });
    const newRefreshToken = signRefreshToken({
      userId: user.id,
      roleId: user.roleId,
      username: user.username,
    });

    const response = NextResponse.json({
      success: true,
      message: "Session refreshed successfully",
      user: {
        userId: user.id,
        username: user.username,
        roleId: user.roleId,
      },
    });

    setAuthCookies(response, newAccessToken, newRefreshToken);
    return response;
  } catch (err) {
    console.error("Token refresh failed:", err);
    return NextResponse.json(
      { success: false, error: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
