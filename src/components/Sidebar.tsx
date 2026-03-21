"use client";

import Link from "next/link";
import { Home, ShoppingCart, User, Settings, UserCircle, LogOut, DollarSign } from "lucide-react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

interface SidebarProps {
    onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
    const pathname = usePathname();
    const sidebarLinks = [
        { href: '/dashboard', content: "Home", icon: <Home /> },
        { href: "/dashboard/marketplace",content: "Marketplace", icon: <ShoppingCart /> },
        { href: "/dashboard/my-artworks", content: "My Artworks", icon: <User /> },
        { href: "/dashboard/deposit", content: "Deposit", icon: <DollarSign /> },
        { href: "/dashboard/settings", content: "Settings", icon: <Settings /> },                
    ];

    return (
        <div className="h-full w-80 sm:w-96 lg:w-auto border-r p-4 sm:p-6 lg:p-8 flex flex-col bg-background text-text border-slate-200 dark:border-slate-900">
            <div className="lg:hidden flex justify-end mb-4">
                <button onClick={onClose} className="text-text cursor-pointer hover:scale-110 transition-transform duration-200">
                    <X size={28} />
                </button>
            </div>
            <div className="text-text">
                <h2 className="text-xl text-center">Artsyl</h2>
                <p className="text-sm italic text-center mt-2 font-light opacity-80">Pursuing your passion for art</p>
            </div>
            <div className="mt-16 flex-col flex justify-between flex-1">
                <ul className="space-y-2">
                    {sidebarLinks.map(link => (
                        <li key={link.href}>
                            <Link href={link.href} onClick={onClose} className={`flex items-center gap-2 text-base hover:bg-secondary p-3 rounded-lg transition-colors ${pathname === link.href ? "bg-secondary" : ""}`}>
                                {link.icon}{link.content}
                            </Link>
                        </li>
                    ))}
                </ul>
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard/profile" onClick={onClose} className={`flex gap-2 text-base hover:bg-secondary hover:bg-opacity-20 p-3 rounded-lg transition-colors ${pathname === "/dashboard/profile" ? "bg-secondary bg-opacity-30 font-semibold" : ""}`}>
                            <UserCircle />Profile
                        </Link>
                    </li>
                    <li>
                        <form action="/api/logout" method="POST" className="w-full">
                            <button type="submit" onClick={onClose} className="w-full flex gap-2 text-base hover:bg-secondary hover:bg-opacity-20 p-3 rounded-lg transition-colors">
                                <LogOut />Logout
                            </button>
                        </form>
                    </li>
                </ul>
            </div>
        </div>
    );
}
