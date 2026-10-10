import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const isJson = request.headers.get("accept")?.includes("application/json") ||
                 request.headers.get("content-type")?.includes("application/json");

  if (isJson) {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
    clearAuthCookies(response);
    return response;
  }

  const redirectUrl = new URL("/auth", process.env.SITE_BASE_URL || request.url);
  const response = NextResponse.redirect(redirectUrl, { status: 303 });
  clearAuthCookies(response);
  return response;
}