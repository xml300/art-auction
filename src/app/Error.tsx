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
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-background animate-fade-in text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="relative flex justify-center">
          <div className="w-52 h-52 relative rounded-2xl overflow-hidden shadow-xl border border-border-subtle bg-surface-elevated">
            <Image
              src="/images/broken-masterpiece.png"
              alt="Broken Masterpiece"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Exhibition Interrupted</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
            A Momentary Flaw in the Gallery
          </h2>

          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Even the finest collections encounter unexpected imperfections. We are working to restore the exhibit to its original splendor.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shadow-xs"
          >
            <RefreshCcw className="w-3.5 h-3.5 mr-2" />
            Try to Restore
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-border-subtle bg-surface text-text text-xs font-semibold hover:bg-surface-elevated transition-colors shadow-xs"
          >
            <Home className="w-3.5 h-3.5 mr-2" />
            Return Home
          </Link>
        </div>

        {error.digest && (
          <p className="text-[10px] font-mono text-text-muted/60 uppercase tracking-widest pt-4">
            Reference ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}