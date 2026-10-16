import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-card bg-stone-200/70 dark:bg-stone-800/70",
        className
      )}
      {...props}
    />
  );
}

export function ArtworkCardSkeleton() {
  return (
    <div className="rounded-card border border-border-subtle bg-surface p-3.5 space-y-3 shadow-gallery">
      <Skeleton className="w-full aspect-[4/5] rounded-gallery" />
      <div className="space-y-2 p-1">
        <Skeleton className="h-4 w-1/3 rounded-gallery" />
        <Skeleton className="h-5 w-3/4 rounded-gallery" />
        <div className="pt-2 flex items-center justify-between border-t border-border-subtle">
          <Skeleton className="h-5 w-24 rounded-gallery" />
          <Skeleton className="h-8 w-20 rounded-card" />
        </div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-card border border-border-subtle bg-surface p-5 space-y-3 shadow-gallery">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-card" />
        <Skeleton className="h-4 w-16 rounded-card" />
      </div>
      <Skeleton className="h-7 w-28 rounded-card" />
      <Skeleton className="h-3.5 w-20 rounded-card" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-border-subtle">
      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
    </tr>
  );
}
