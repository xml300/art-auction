import { ArtworkCardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ArtworkCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}