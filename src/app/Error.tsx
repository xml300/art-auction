"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RefreshCcw, Home, AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-background animate-fade-in">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex justify-center">
            <div className="w-64 h-64 relative rounded-2xl overflow-hidden shadow-2xl border border-secondary/30 bg-secondary/5">
              <Image
                src="/images/broken-masterpiece.png"
                alt="Broken Masterpiece"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-accent text-xs font-medium uppercase tracking-wider">
            <AlertCircle className="w-3 h-3" />
            <span>Exhibition Interrupted</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
            A Momentary Flaw in the Gallery
          </h2>
          
          <p className="text-base text-text/70 font-light leading-relaxed">
            Even the finest collections encounter unexpected imperfections. 
            We're working to restore the exhibit to its original splendor.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-white font-medium transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-95 group"
          >
            <RefreshCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Try to Restore
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-full border border-secondary text-text font-medium transition-all hover:bg-secondary/10 active:scale-95 group"
          >
            <Home className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
            Return Home
          </Link>
        </div>

        {error.digest && (
          <p className="text-[10px] font-mono text-text/30 uppercase tracking-[0.2em] pt-8">
            Reference ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}