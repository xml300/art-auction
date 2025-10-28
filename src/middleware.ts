
export default function middleware(request: Request) {
    console.log(request);
//     const authCookie = request.cookies.get("auth");
//     if(!authCookie){
//         return NextResponse.redirect(new URL("/auth", request.url));
//     }
    return null;
}

// export const config = {
//     matcher: ['/dashboard/:path*','/artist-dashboard/:path*'],
// }
