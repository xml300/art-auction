import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-background text-text animate-fade-in space-y-4">
      <span className="text-xs uppercase font-bold tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
        404 Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">
        Lot Not In Catalogue
      </h1>
      <p className="text-xs sm:text-sm text-text-muted max-w-md">
        The exhibit or lot you are looking for does not exist or may have been transferred to a private collection.
      </p>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to Gallery
        </Link>
      </div>
    </div>
  );
}
