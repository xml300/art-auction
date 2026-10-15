import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Admin } from "@/models";
import { Roles } from "@/enums";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [session] = await getSession();

    if (!session || session.roleId !== Roles.Admin) {
      return NextResponse.json(
        { success: false, error: "Access denied. Administrator privileges required." },
        { status: 403 }
      );
    }

    const metrics = await Admin.getMetrics();

    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error) {
    console.error("Admin metrics route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
