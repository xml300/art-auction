"use client";

import Link from "next/link";
import { Home, ShoppingCart, User, Settings, UserCircle, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

interface SidebarProps {
    onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="h-full w-80 sm:w-96 lg:w-auto border-r-2 p-6 sm:p-8 lg:p-12 flex flex-col bg-white text-gray-900 dark:bg-dark-background dark:text-dark-text border-gray-200 dark:border-gray-700">
            <div className="lg:hidden flex justify-end mb-4">
                <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:scale-110 transition-transform duration-200">
                    <X size={28} />
                </button>
            </div>
            <div className="text-black dark:text-dark-text">
                <h2 className="text-3xl text-center">Artsyl</h2>
                <p className="text-lg italic text-center mt-2 font-light">Pursuing your passion for art</p>
            </div>
            <div className="mt-16 flex-col flex justify-between flex-1">
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard" onClick={onClose} className={`flex gap-2 text-xl hover:bg-red-200 dark:hover:bg-red-700 p-3 rounded-lg ${pathname === "/dashboard" ? "bg-red-200 dark:bg-red-700" : ""}`}>
                            <Home />Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/marketplace" onClick={onClose} className={`flex gap-2 text-xl hover:bg-red-200 dark:hover:bg-red-700 p-3 rounded-lg ${pathname === "/dashboard/marketplace" ? "bg-red-200 dark:bg-red-700" : ""}`}>
                            <ShoppingCart />Marketplace
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/my-artworks" onClick={onClose} className={`flex gap-2 text-xl hover:bg-red-200 dark:hover:bg-red-700 p-3 rounded-lg ${pathname === "/dashboard/my-artworks" ? "bg-red-200 dark:bg-red-700" : ""}`}>
                            <User />My Artworks
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/settings" onClick={onClose} className={`flex gap-2 text-xl hover:bg-red-200 dark:hover:bg-red-700 p-3 rounded-lg ${pathname === "/dashboard/settings" ? "bg-red-200 dark:bg-red-700" : ""}`}>
                            <Settings />Settings
                        </Link>
                    </li>
                </ul>
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard/profile" onClick={onClose} className={`flex gap-2 text-xl hover:bg-red-200 dark:hover:bg-red-700 p-3 rounded-lg ${pathname === "/dashboard/profile" ? "bg-red-200 dark:bg-red-700" : ""}`}>
                            <UserCircle />Profile
                        </Link>
                    </li>
                    <li>
                        <form action="/api/logout" method="POST" className="w-full">
                            <button type="submit" onClick={onClose} className="w-full flex gap-2 text-xl hover:bg-red-200 dark:hover:bg-red-700 p-3 rounded-lg">
                                <LogOut />Logout
                            </button>
                        </form>
                    </li>
                </ul>
            </div>
        </div>
    );
}
