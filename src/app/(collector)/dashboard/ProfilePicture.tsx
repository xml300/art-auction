import Image from "next/image";
import { useSession } from "@/hooks/useSession";

export default function ProfilePicture() {
    const { session } = useSession();
    const profilePicture = session?.profilePicture || "/default-avatar.png";

    return (
        <Image
            src={profilePicture}
            className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full object-cover bg-surface-elevated hover:scale-105 transition-transform duration-200"
            width={40}
            height={40}
            alt="User Profile"
        />
    );

}