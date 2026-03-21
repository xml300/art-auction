import { getUsersProfile, updateUser } from "@/data/queries";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; 
import { writeFile } from "@/lib/fileSys";

// async function closeAuction(){
//     const artworks = (await getArtworks()).filter(artwork => artwork.auctionEndTime < new Date());
//     for(const artwork of artworks){
//         const bids = (await getBids(artwork.id)).sort((a: Bid, b: Bid) => {
//             return a.bidAmount < b.bidAmount ? 1 : -1;
//         });
//         if(bids.length == 0){
//             return;
//         }
//         const winningBid = bids.at(0);
//         updateArtwork(artwork.id, {ownerId: winningBid?.bidderId || null}); 
//     }
// }


export async function GET() {
    const [session, error] = await getSession();

    if (error || session === null) {
        const response = NextResponse.json({});
        response.cookies.set('errors', error || "", {
            maxAge: 10,
            path: '/',
        });
        return response;
    }

    // closeAuction();

    const user = await getUsersProfile(session.userId);
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

async function saveFile(file: File, userId: number){
    if(file.size <= 0){
        return "";
    }
    const filePath = `uploads/${userId}/`;
    const path = await writeFile(file, filePath);
    if(path instanceof Error || path === null || path === undefined){
        return "";
    }
    return path;
}

export async function POST(request: NextRequest) {
    const [session, error] = await getSession();
    const redirectURL = new URL('/dashboard/settings', request.url);


    if (error || session === null) {
        const response = NextResponse.redirect(redirectURL, {status: 303});
        response.cookies.set('errors', error || "", {
            maxAge: 10,
            path: '/',
        });
        return response;
    }

    const userId = session.userId;
    const body = await request.formData();
    const profilePicture = body.get('profile_picture') as unknown as File;


    const surname = body.get('surname')?.toString();
    const firstName = body.get('first_name')?.toString();
    const userName = body.get('username')?.toString();
    const email = body.get('email')?.toString();
    const bio = body.get('about_you')?.toString();

     if(!surname || !firstName || !userName || !email || !bio){
        const response = NextResponse.redirect(redirectURL, {status: 303});
        response.cookies.set('errors', 'All fields are required', {
            maxAge: 10,
            path: '/',
        });
        return response;
    }

    const savedPath = await saveFile(profilePicture, userId);

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
