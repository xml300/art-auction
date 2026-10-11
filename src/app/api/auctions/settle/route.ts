import { NextResponse } from "next/server";
import { settleExpiredAuctions } from "@/lib/auctionSettlement";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const results = await settleExpiredAuctions();
    return NextResponse.json({
      success: true,
      settledCount: results.filter((r) => r.status === "settled").length,
      results,
    });
  } catch (error) {
    console.error("Auction settlement route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
