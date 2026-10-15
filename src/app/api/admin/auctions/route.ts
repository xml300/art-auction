import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Admin } from "@/models";
import { Roles } from "@/enums";

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
    const statusParam = searchParams.get("status") as "all" | "active" | "pending_settlement" | "settled" | null;
    const status = statusParam || "all";
    const search = searchParams.get("search") || undefined;
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));

    const result = await Admin.getAdminArtworks({ status, search, page, limit });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Admin artworks list error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
