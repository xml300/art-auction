import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="text-center py-4 border-t shadow-md bg-background text-text border-secondary animate-fade-in">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-base">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-left space-y-4 animate-fade-in">
                        <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
                        <p className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"><Phone className="h-6 w-6" /> +234123456789</p>
                        <p className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"><Mail className="h-6 w-6" /> artsy-auction@artsyl.com</p>
                    </div>

                    <div className="text-left animate-fade-in">
                        <h3 className="font-bold mb-4 text-lg">Navigation</h3>
                        <ul className="space-y-4 font-light">
                            <li className="hover:scale-105 transition-transform duration-200"><Link href="/" className="">Home</Link></li>
                            <li className="hover:scale-105 transition-transform duration-200"><Link href="" className="">About</Link></li>
                            <li className="hover:scale-105 transition-transform duration-200"><Link href="" className="">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div className="text-left animate-fade-in">
                        <h3 className="font-bold mb-4 text-lg">Products</h3>
                        <ul className="space-y-4 font-light">
                            <li className="hover:scale-105 transition-transform duration-200"><Link href="/dashboard" className="">Auction</Link></li>
                            <li className="hover:scale-105 transition-transform duration-200"><Link href="/dashboard" className="">Showcase</Link></li>
                        </ul>
                    </div>

                    <div className="text-left animate-fade-in">
                        <h3 className="font-bold mb-4 text-lg">Socials</h3>
                        <ul className="space-y-4 font-light">
                            <li className="hover:scale-105 transition-transform duration-200">
                                <a href="#" className="flex items-center gap-2 ">
                                    <Facebook className="h-6 w-6" /> Facebook
                                </a>
                            </li>
                            <li className="hover:scale-105 transition-transform duration-200">
                                <a href="#" className="flex items-center gap-2 ">
                                    <Instagram className="h-6 w-6" /> Instagram
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="my-12 h-0.5 bg-secondary" />

            <div className="max-w-7xl mx-auto px-4 text-sm mb-2">
                <Link href="" className=" hover:underline ">
                    Privacy Policy / Terms & Conditions
                </Link>
                  <p className="font-light italic mt-8">&copy; 2025 Artsyl. All rights reserved.</p>
            </div>
        </footer>
    );
}
