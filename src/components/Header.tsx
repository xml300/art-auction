import Image from "next/image";
import Link from "next/link";

export function Header() {
    return (
        <header className="py-2 shadow-b-lg border-b-2">
            <nav className="flex justify-between px-6">
                <Image
                    src="/logo.png"
                    alt="Artsyl Logo"
                    width={50}
                    height={50} 
                />
                <ul className="flex gap-4 items-center">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li className="ml-2 group relative">
                        <button className="rounded-full bg-red-700 px-4 py-2 text-white">Sign Up</button>
                        <div className="absolute flex-col gap-y-1 bg-white rounded-md p-2 w-36 right-0 z-20 hidden group-hover:flex">
                            <Link href="/auth?acc_type=artist" className="hover:bg-red-300 rounded-md p-2">As an artist</Link>
                            <Link href="/auth?acc_type=collector" className="hover:bg-red-300 rounded-md p-2">As a collector</Link>
                        </div>
                    </li>
                </ul>
            </nav>
        </header>
    );
}