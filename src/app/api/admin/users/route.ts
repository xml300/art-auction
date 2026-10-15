import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Admin } from "@/models";
import { Roles } from "@/enums";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const [session] = await getSession();

    if (!session || session.roleId !== Roles.Admin) {
      return NextResponse.json(
        { success: false, error: "Access denied. Administrator privileges required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const roleIdParam = searchParams.get("roleId");
    const roleId = roleIdParam !== null && roleIdParam !== "" ? Number(roleIdParam) : undefined;
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));

    const result = await Admin.getUsersList({ search, roleId, page, limit });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Admin users list error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const [session] = await getSession();

    if (!session || session.roleId !== Roles.Admin) {
      return NextResponse.json(
        { success: false, error: "Access denied. Administrator privileges required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, roleId } = body;

    if (!userId || roleId === undefined || ![Roles.Admin, Roles.Artist, Roles.Collector].includes(roleId)) {
      return NextResponse.json(
        { success: false, error: "Invalid userId or roleId" },
        { status: 400 }
      );
    }

    const updated = await Admin.updateUserRole(Number(userId), Number(roleId));

    await logAuditEvent(request, {
      actorId: session.userId,
      actorType: "admin",
      action: "admin.user.role_change",
      resourceType: "user",
      resourceId: String(userId),
      status: "success",
      metadata: { targetUserId: userId, newRoleId: roleId },
    });

    return NextResponse.json({
      success: true,
      user: updated,
    });
  } catch (error) {
    console.error("Admin user role update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
