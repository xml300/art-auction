import { getTransactions } from "@/data/queries";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const [payload, error] = await getSession();

    if (error || payload === null) {
        return NextResponse.json({ message: error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const { transactions, totalCount } = await getTransactions(payload.userId, { sortBy: 'transactionTime', sortOrder: 'desc', page, limit });

    return NextResponse.json({ transactions, totalCount });
}
