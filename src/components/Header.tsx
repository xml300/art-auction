"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import ThemeToggle from "./ThemeToggle";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    return (
        <header className="px-4 sm:px-6 lg:px-8 py-4 shadow-b-lg border-b-2 bg-white dark:bg-dark-background dark:border-dark-secondary">
            <nav className="flex justify-between items-center">
                <div className="">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Artsyl Logo"
                            width={50}
                            height={50}
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <ul className="hidden lg:flex gap-4 items-center justify-center text-lg text-black dark:text-dark-text animate-fade-in">
                    <li className="flex items-center justify-center"><ThemeToggle className="w-8 h-8" /></li>
                    <li className="hover:scale-105 transition-transform duration-200"><Link href="/">Home</Link></li>
                    <li className="hover:scale-105 transition-transform duration-200"><Link href="/about">About</Link></li>
                    <li className="ml-2 group relative hover:scale-105 transition-transform duration-200">
                        <Link href="/auth" className="block rounded-full bg-red-700 px-6 py-2 text-white">Sign Up</Link>
                    </li>
                </ul>

                {/* Mobile Hamburger Icon */}
                <div className="lg:hidden flex items-center gap-2 animate-fade-in">
                    <ThemeToggle className="w-8 h-8" />
                    <button
                        onClick={toggleMobileMenu}
                        className="text-black dark:text-dark-text hover:scale-95 transition-transform duration-200"
                    >
                        {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleMobileMenu}
                ></div>
            )}

            {/* Mobile Navigation Menu */}
            <div
                className={`fixed top-0 right-0 w-64 h-full bg-white dark:bg-dark-background shadow-lg z-50 transform transition-transform isolate duration-300 ease-in-out lg:hidden ${
                    isMobileMenuOpen ? "animate-mobile-menu" : "animate-mobile-menu-close"
                }`}
            >
                <div className="flex justify-end p-4">
                    <button
                        onClick={toggleMobileMenu}
                        className="text-black dark:text-dark-text hover:scale-95 transition-transform duration-200"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>
                <ul className="flex flex-col justify-between h-[80%] items-center text-xl text-black dark:text-dark-text mt-8">
                    <div className="space-y-4 w-full px-4">
                        <li className="hover:bg-red-800 w-full text-center p-2 rounded-lg hover:scale-105 transition-transform duration-200">
                            <Link href="/" onClick={toggleMobileMenu}>Home</Link>
                        </li>
                        <li className="hover:bg-red-800 w-full text-center p-2 rounded-lg hover:scale-105 transition-transform duration-200">
                            <Link href="/about" onClick={toggleMobileMenu}>About</Link>
                        </li>
                    </div>
                    <li className="flex gap-x-4">
                        <Link href="/auth" className="block rounded-full bg-red-700 px-6 py-2 text-white text-lg hover:scale-105 transition-transform duration-200" onClick={toggleMobileMenu}>Sign In</Link>
                        <Link href="/auth" className="block rounded-full bg-red-700 px-6 py-2 text-white text-lg hover:scale-105 transition-transform duration-200" onClick={toggleMobileMenu}>Sign Up</Link>
                    </li>
                </ul>
            </div>
        </header>
    );
}
