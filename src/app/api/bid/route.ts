import { getBids, getUsers, User } from "@/data/db";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const [session, error] = await getSession();
    const searchParams = request.nextUrl.searchParams;
    const artworkId = searchParams.get('artworkId');

    if(error || session == null){
        return NextResponse.json({message: "User unauthorized"}, {status: 401});
    }
    const user = getUsers(session!.userId) as User;
    if(artworkId){
        const artId = parseInt(artworkId);
        const bid = getBids(artId, {sortBy: 'bidTime', sortOrder: 'desc', where: [
            {columnName: 'bidderId', value: user.id}
        ]}).at(0);
        if(!bid){
            return NextResponse.json({message: 'Bid not found'}, {status: 404})
        }
        return NextResponse.json(bid);
    }
    const bids = getBids(user.id);   
    return NextResponse.json(bids);
}