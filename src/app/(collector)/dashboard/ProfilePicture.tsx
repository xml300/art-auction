import Image from "next/image";
import { getSession } from "@/lib/auth";

export default async function ProfilePicture() {
    const [session] = await getSession();
    const profilePicture = session?.profilePicture || "";

    return (
        <Image
            src={profilePicture}
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-black dark:bg-white hover:scale-110 transition-transform duration-200"
            width={100}
            height={100}
            alt="User Profile"
        />
    );

}