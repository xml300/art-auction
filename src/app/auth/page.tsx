import { cookies } from "next/headers";
import AuthSection from "./AuthSection";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";

export default async function AuthPage() {
  const cookieStore = await cookies();
  const error = cookieStore.get("errors")?.value;

  return (
    <main className="flex flex-col min-h-screen justify-center items-center px-4 py-12 bg-background text-text relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <Link href="/" className="mb-6 flex flex-col items-center gap-2 group">
          <Image
            src="/logo.png"
            width={48}
            height={48}
            alt="Artsyl Logo"
            className="rounded-full shadow-xs group-hover:scale-105 transition-transform duration-200"
          />
          <span className="font-bold text-lg tracking-tight text-text">Artsyl</span>
        </Link>

        <div className="w-full rounded-2xl shadow-xl p-6 sm:p-8 bg-surface border border-border-subtle backdrop-blur-sm animate-fade-in">
          <AuthSection error={error || ""} />
        </div>

        <p className="text-xs text-text-muted mt-6 text-center">
          By continuing, you agree to Artsyl&apos;s Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
