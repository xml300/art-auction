import { cookies } from 'next/headers';
import AuthSection from './AuthSection';
import Link  from "next/link";
import Image from 'next/image';
import ThemeToggle from "@/components/ThemeToggle";

export default async function AuthPage(){
    const cookieStore = await cookies();
    const error = cookieStore.get('errors')?.value;

    return (
        <main className="flex flex-col min-h-screen max-w-7xl mx-auto justify-center items-center bg-white dark:bg-dark-background text-black dark:text-dark-text">
            <div className="absolute top-8 right-8">
                <ThemeToggle className="w-8 h-8" />
            </div>
            <Link href="/">
                <Image src="/logo.png" width={80} height={80} alt="Logo" />
            </Link>

            <div className="w-full max-w-xl mx-auto rounded-2xl shadow-2xl p-6 mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
               <AuthSection error={error || ""} />
            </div>
        </main>
    );
}
