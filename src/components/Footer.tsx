import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="text-center py-4 border-t shadow-md">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-left space-y-4">
                        <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
                        <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +234123456789</p>
                        <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> artsy-auction@artsyl.com</p>
                    </div>

                    <div className="text-left">
                        <h3 className="font-bold text-lg mb-2">Navigation</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="hover:underline">Home</Link></li>
                            <li><Link href="/about" className="hover:underline">About</Link></li>
                            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div className="text-left">
                        <h3 className="font-bold text-lg mb-2">Products</h3>
                        <ul className="space-y-2">
                            <li><Link href="/auction" className="hover:underline">Auction</Link></li>
                            <li><Link href="/showcase" className="hover:underline">Showcase</Link></li>
                        </ul>
                    </div>

                    <div className="text-left">
                        <h3 className="font-bold text-lg mb-2">Socials</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="flex items-center gap-2 hover:underline">
                                    <Facebook className="h-4 w-4" /> Facebook
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 hover:underline">
                                    <Instagram className="h-4 w-4" /> Instagram
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 mt-8">
                <hr className="h-0.5 bg-black/10 my-4" />
                <Link href="/privacy-terms" className="font-semibold hover:underline">
                    Privacy Policy / Terms & Conditions
                </Link>
                <hr className="h-0.5 bg-black/10 my-4" />
                <p className="font-light italic">&copy; 2025 Artsyl. All rights reserved.</p>
            </div>
        </footer>
    );
}