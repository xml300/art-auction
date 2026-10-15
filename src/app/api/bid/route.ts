import { getBids, getUser } from "@/data/queries";
import {User} from "@/types";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const [session] = await getSession();
    const searchParams = request.nextUrl.searchParams;
    const artworkId = searchParams.get('artworkId');
    const user = await getUser(session!.userId) as User;
    if(artworkId){
        const artId = parseInt(artworkId);
        const bid = (await getBids(artId, {sortBy: 'bidTime', sortOrder: 'desc', where: [
            {columnName: 'bidderId', value: user.id}
        ]})).at(0);
        if(!bid){
            return NextResponse.json({message: 'Bid not found'}, {status: 404})
        }
        return NextResponse.json(bid);
    }
    const bids = await getBids(user.id);   
    return NextResponse.json(bids);
}