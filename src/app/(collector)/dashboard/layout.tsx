"use client";

import Sidebar from "@/components/Sidebar";
import { SwitchThemeToggle } from "@/components/ThemeToggle";
import { LogOut, UserCircle, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [profilePicture, setProfilePicture] = useState<string>("/null"); 

    useEffect(() => {
        fetch('/api/profile')
        .then(res => res.json())
        .then(json => {
            setProfilePicture(json.profilePicture) 
        })
    }, []);

 

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <main className="flex h-screen overflow-hidden relative">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleMobileMenu} />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out lg:static lg:block`}>
                <Sidebar onClose={toggleMobileMenu} />
            </div>

            {/* Main Content */}
            <section className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="w-full border-b-2 px-4 sm:px-6 lg:px-12 py-4 flex justify-between items-center shadow-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden text-gray-600 dark:text-gray-300 hover:scale-110 transition-transform duration-200"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Dashboard</h2>

                    <div className="flex items-center gap-4">
                        <div className="group relative">
                            <Image
                                src={profilePicture}
                                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-black dark:bg-white hover:scale-110 transition-transform duration-200"
                                width={100}
                                height={100}
                                alt="User Profile"
                            />
                            <div className="hidden group-hover:flex absolute right-0 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg min-w-48 p-2 animate-fade-in z-50" style={{animationDuration: '0.3s'}}>
                                <ul className="space-y-2 w-full">
                                    <li className="px-4 py-2 w-full flex gap-x-2 hover:scale-105 transition-transform duration-200">
                                        <SwitchThemeToggle />
                                        Dark Mode
                                    </li>
                                    <hr className="border-gray-200 dark:border-gray-700" />
                                    <li className="hover:bg-red-200 dark:hover:bg-red-700 px-4 py-2 rounded-lg w-full hover:scale-105 transition-transform duration-200">
                                        <Link href="/dashboard/profile" className="flex gap-x-2 items-center">
                                            <UserCircle />Profile
                                        </Link>
                                    </li>
                                    <li className="hover:bg-red-200 dark:hover:bg-red-700 px-4 py-2 rounded-lg w-full hover:scale-105 transition-transform duration-200">
                                        <form action="/api/logout" method="POST">
                                            <button type="submit" className="flex gap-2 hover:bg-red-200 dark:hover:bg-red-700 rounded-lg">
                                                <LogOut />Logout
                                            </button>
                                        </form>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 p-4 sm:p-6 xl:p-12 overflow-y-auto">
                    {children}
                </div>
            </section>
        </main>
    );
}
