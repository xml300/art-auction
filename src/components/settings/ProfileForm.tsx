"use client";

import { api } from "@/lib/api";
import { CollectorProfile } from "@/types";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ProfileForm({ errors }: { errors?: string }) {
    const [profile, setProfile] = useState({
        surname: "",
        firstName: "",
        username: "",
        email: "",
        bio: "",
        profilePicture: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get<CollectorProfile>("/profile");
                setProfile({ ...response });
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [id]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log(file, URL.createObjectURL(file))
            // For now, we'll just store the file name or a base64 representation if needed.
            // In a real application, you'd upload this to a storage service.
            setProfile((prevProfile) => ({
                ...prevProfile,
                profilePicture: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = async () => {
        // e.preventDefault();
    };

    return (
        <form method="POST" action="/api/profile" onSubmit={handleSubmit} className="p-12 w-full" encType="multipart/form-data">
            {errors && (<div className={`bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-8 transition-transform animate-fade-in`} role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {errors}</span>
            </div>)}
            <div className="flex mb-6">
                <label htmlFor="profile_picture" className="relative group cursor-pointer">
                    <Image src={profile.profilePicture || "/logo.png"} width={80} height={80} className="w-24 h-24 bg-black/10 rounded-lg" alt="Profile" />
                    <div className="absolute top-0 z-20 w-24 h-24 opacity-0 flex transition-opacity duration-300 group-hover:opacity-100 justify-center items-center bg-black/20 rounded-lg">
                        <Camera className="text-white w-8 h-8" />
                    </div>
                </label>
                <input type="file" className="hidden" name="profile_picture" id="profile_picture" onChange={handleFileChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-4 w-full">
                <div className="w-full">
                    <label htmlFor="surname" className="dark:text-white">Surname</label>
                    <input type="text" id="surname" name="surname" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Enter your surname" value={profile.surname} onChange={handleChange} />
                </div>
                <div className="w-full">
                    <label htmlFor="firstName" className="dark:text-white">First Name</label>
                    <input type="text" id="firstName" name="first_name" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Enter your first name" value={profile.firstName} onChange={handleChange} />
                </div>
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="username" className="dark:text-white">Username</label>
                <input type="text" id="username" name="username" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Enter your username" value={profile.username} onChange={handleChange} />
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="email" className="dark:text-white">Email</label>
                <input type="text" id="email" name="email" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Enter your email" value={profile.email} onChange={handleChange} />
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="bio" className="dark:text-white">About you</label>
                <textarea rows={5} id="bio" name="about_you" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Enter information about yourself" value={profile.bio} onChange={handleChange} />
            </div>
            <button type="submit" className="bg-black text-white rounded-lg px-6 py-2 mt-4">Save Changes</button>
        </form>
    );
}
