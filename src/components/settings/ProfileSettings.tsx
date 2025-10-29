import { Camera } from "lucide-react";
import Image from "next/image";

export default function ProfileSettings() {
    return (
        <div className="p-12 w-full">
            <div className="flex mb-6">
                <label htmlFor="profile_picture" className="relative group">
                    <Image src="/logo.png" width={80} height={80} className="w-24 h-24 bg-black/10 rounded-lg" alt="Profile" />
                    <div className="absolute top-0 z-20 w-24 h-24 hidden group-hover:flex justify-center items-center bg-black/20 rounded-lg">
                        <Camera className="text-white w-8 h-8" />
                    </div>
                </label>
                <input type="file" className="hidden" name="profile_picture" id="profile_picture" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-4 w-full">
                <div className="w-full">
                    <label htmlFor="surname" className="dark:text-white">Surname</label>
                    <input type="text" id="surname" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Enter your surname" />
                </div>
                <div className="w-full">
                    <label htmlFor="first_name" className="dark:text-white">First Name</label>
                    <input type="text" id="first_name" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Enter your first name" />
                </div>
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="username" className="dark:text-white">Username</label>
                <input type="text" id="username" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Enter your username" />
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="email" className="dark:text-white">Email</label>
                <input type="text" id="email" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Enter your email" />
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="about_you" className="dark:text-white">About you</label>
                <textarea rows={5} id="about_you" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Enter information about yourself" />
            </div>
            <button type="submit" className="bg-black text-white rounded-lg px-6 py-2 mt-4">Save Changes</button>
        </div>
    );
}
