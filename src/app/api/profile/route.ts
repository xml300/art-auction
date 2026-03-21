import { getArtworks, getBids, getUsersProfile, updateArtwork, updateUser } from "@/data/queries";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; 
import { Bid } from "@/types";

async function closeAuction(){
    const artworks = (await getArtworks()).filter(artwork => artwork.auctionEndTime < new Date());
    for(const artwork of artworks){
        const bids = (await getBids(artwork.id)).sort((a: Bid, b: Bid) => {
            return a.bidAmount < b.bidAmount ? 1 : -1;
        });
        if(bids.length == 0){
            return;
        }
        const winningBid = bids.at(0);
        updateArtwork(artwork.id, {ownerId: winningBid?.bidderId || null}); 
    }
}


export async function GET() {
    const [payload, error] = await getSession();

    if (error || payload === null) {
        const response = NextResponse.json({});
        response.cookies.set('errors', error || "", {
            maxAge: 10,
            path: '/',
        });
        return response;
    }

    // closeAuction();

    const user = await getUsersProfile(payload.userId);
    if (user) {
        return NextResponse.json(user);
    }
    const response = NextResponse.json({});
    response.cookies.set('errors', 'User not found', {
        maxAge: 10,
        path: '/',
    });
    return response;
}

// async function saveFile(file: File){
//     if(file.size <= 0){
//         return "";
//     }
//     const filename = hashValue(Array.from({length: 10}).map(() => Math.random() * 500 + 100).join('')) + file.name.split('.').at(-1);
//     writeFileSync(`./public/uploads/${filename}`, Buffer.from(await file.arrayBuffer()));
//     return `/uploads/${filename}`;
// }

export async function POST(request: NextRequest) {
    const [payload, error] = await getSession();
    const redirectURL = new URL('/dashboard/settings',process.env.SITE_BASE_URL || "");


    if (error || payload === null) {
        const response = NextResponse.redirect(redirectURL, {status: 303});
        response.cookies.set('errors', error || "", {
            maxAge: 10,
            path: '/',
        });
        return response;
    }

    const userId = payload.userId;
    const body = await request.formData();
    // const profilePicture = body.get('profile_picture') as unknown as File;


    const surname = body.get('surname')?.toString();
    const firstName = body.get('first_name')?.toString();
    const userName = body.get('username')?.toString();
    const email = body.get('email')?.toString();
    const bio = body.get('about_yout')?.toString();

     if(!surname || !firstName || !userName || !email || !bio){
        const response = NextResponse.redirect(redirectURL, {status: 303});
        response.cookies.set('errors', 'All fields are required', {
            maxAge: 10,
            path: '/',
        });
        return response;
    }

    // const savedPath = await saveFile(profilePicture);
    const savedPath = "/logo.png"


    const updatedUser = await updateUser(userId,
        {profilePicture: savedPath, surname: surname, firstName: firstName, username: userName, email: email, bio: bio}
    );

    if (updatedUser) {
        const response = NextResponse.redirect(redirectURL, {status: 303});
        response.cookies.set('success', "Profile updated successfully", {
            maxAge: 10,
            path: '/',
        });
        return response;
    }
    const response = NextResponse.redirect(redirectURL, {status: 303});
    response.cookies.set('errors', "User not found or update failed", {
        maxAge: 10,
        path: '/',
    });
    return response;
}
