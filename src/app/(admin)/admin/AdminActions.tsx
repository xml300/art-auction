"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gavel, RefreshCw, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export default function AdminActions() {
  const router = useRouter();
  const [isSettling, setIsSettling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSettle = async () => {
    setIsSettling(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auctions/settle", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({
          text: `Settlement complete! ${data.settledCount ?? 0} auction(s) finalized.`,
          type: "success",
        });
        router.refresh();
      } else {
        setMessage({
          text: data.error || "Failed to settle auctions.",
          type: "error",
        });
      }
    } catch {
      setMessage({
        text: "Network error during settlement run.",
        type: "error",
      });
    } finally {
      setIsSettling(false);
    }
  };

  const handleRefreshDates = async () => {
    setIsRefreshing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/system/refresh", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({
          text: data.message || "Auction end times refreshed.",
          type: "success",
        });
        router.refresh();
      } else {
        setMessage({
          text: data.error || "Failed to refresh auction dates.",
          type: "error",
        });
      }
    } catch {
      setMessage({
        text: "Network error during dates refresh.",
        type: "error",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={handleSettle}
          disabled={isSettling || isRefreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
        >
          {isSettling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Gavel className="w-4 h-4" />
          )}
          {isSettling ? "Settling Auctions..." : "Run Auction Settlement"}
        </button>

        <button
          onClick={handleRefreshDates}
          disabled={isSettling || isRefreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-border-subtle bg-surface hover:bg-surface-elevated text-text disabled:opacity-50 transition-all cursor-pointer"
        >
          {isRefreshing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {isRefreshing ? "Refreshing..." : "Extend Active Dates"}
        </button>

        <button
          onClick={() => router.refresh()}
          disabled={isSettling || isRefreshing}
          aria-label="Refresh overview data"
          className="p-2 rounded-xl border border-border-subtle bg-surface hover:bg-surface-elevated text-text-muted hover:text-text transition-colors cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
}
