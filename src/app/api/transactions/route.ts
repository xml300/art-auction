import { getTransactions } from "@/data/queries";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const [session] = await getSession();
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const { transactions, totalCount } = await getTransactions(session!.userId, { sortBy: 'createdAt', sortOrder: 'desc', page, limit });

    return NextResponse.json({ transactions, totalCount });
}
