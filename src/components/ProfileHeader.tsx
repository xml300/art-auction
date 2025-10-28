import Image from "next/image";
import Link from "next/link";
import { Twitter, Instagram } from "lucide-react";

interface ProfileHeaderProps {
    name: string;
    username: string;
    profilePicture: string;
    bio: string;
    socialMedia: {
        twitter?: string;
        instagram?: string;
    };
}

export default function ProfileHeader({ name, username, profilePicture, bio, socialMedia }: ProfileHeaderProps) {
    return (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
                <Image
                    src={profilePicture}
                    alt="Profile Picture"
                    width={150}
                    height={150}
                    className="rounded-full object-cover"
                />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-semibold">{name}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">@{username}</p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{bio}</p>
                <div className="flex justify-center md:justify-start gap-4 mt-4">
                    {socialMedia.twitter && (
                        <Link href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                            <Twitter size={24} />
                        </Link>
                    )}
                    {socialMedia.instagram && (
                        <Link href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700">
                            <Instagram size={24} />
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
