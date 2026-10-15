import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Roles } from "@/enums";
import { refreshAuctionDates } from "@/db/refresh-auctions";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const [session] = await getSession();

    if (!session || session.roleId !== Roles.Admin) {
      return NextResponse.json(
        { success: false, error: "Access denied. Administrator privileges required." },
        { status: 403 }
      );
    }

    await refreshAuctionDates();

    await logAuditEvent(request, {
      actorId: session.userId,
      actorType: "admin",
      action: "admin.system.refresh_auction_dates",
      resourceType: "system",
      status: "success",
      metadata: { triggeredBy: session.username },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully refreshed active auction dates into the future.",
    });
  } catch (error) {
    console.error("System refresh error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
