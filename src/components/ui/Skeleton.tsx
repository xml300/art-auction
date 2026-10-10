import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/60",
        className
      )}
      {...props}
    />
  );
}

export function ArtworkCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-3 space-y-3 shadow-xs">
      <Skeleton className="w-full h-56 rounded-xl" />
      <div className="space-y-2 p-1">
        <Skeleton className="h-5 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />
        <div className="pt-2 flex items-center justify-between">
          <Skeleton className="h-6 w-24 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-5 space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
      <Skeleton className="h-7 w-28 rounded-lg" />
      <Skeleton className="h-3.5 w-20 rounded-md" />
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
