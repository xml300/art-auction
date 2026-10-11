import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, getSession } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const [session] = await getSession();
  if (session) {
    await logAuditEvent(request, {
      actorId: session.userId,
      actorType: "user",
      action: "auth.logout",
      resourceType: "user",
      resourceId: String(session.userId),
      status: "success",
    });
  }

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