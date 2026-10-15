"use client";

import { useState } from "react";
import {
  Gavel,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Clock,
} from "lucide-react";

export default function AdminSystemPage() {
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
          text: `Settlement execution completed successfully. ${data.settledCount ?? 0} lots settled.`,
          type: "success",
        });
      } else {
        setMessage({
          text: data.error || "Failed to execute auction settlement.",
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
          text: data.message || "Active auction dates updated successfully.",
          type: "success",
        });
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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-primary">
            Infrastructure & Operations
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-text">
            System Maintenance & Batch Jobs
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Execute auction batch settlement, simulate auction timetables, and verify platform health.
          </p>
        </div>
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

      {/* Operational Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Settlement Job */}
        <div className="p-5 rounded-2xl border border-border-subtle bg-surface space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text">Auction Settlement Engine</h3>
              <p className="text-xs text-text-muted">Process expired lots and release escrows</p>
            </div>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Scans all unsold artworks where <code className="font-mono text-primary">auction_end_time &lt;= NOW()</code>, determines the winning bidder, transfers artwork ownership, calculates the 10% platform commission fee, posts immutable double-entry ledger entries, and notifies the winner and artist.
          </p>
          <div>
            <button
              onClick={handleSettle}
              disabled={isSettling}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
            >
              {isSettling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              {isSettling ? "Executing Settlement Job..." : "Trigger Settlement Run"}
            </button>
          </div>
        </div>

        {/* Timetable Refresh */}
        <div className="p-5 rounded-2xl border border-border-subtle bg-surface space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text">Auction Timetable Extension</h3>
              <p className="text-xs text-text-muted">Simulate ongoing marketplace activity</p>
            </div>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Distributes end times for all active unowned artworks between 5 and 35 days in the future relative to the current timestamp. Useful for portfolio demonstrations, continuous testing, and keeping the catalog active.
          </p>
          <div>
            <button
              onClick={handleRefreshDates}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-border-subtle bg-surface hover:bg-surface-elevated text-text disabled:opacity-50 transition-all cursor-pointer"
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {isRefreshing ? "Updating Timetables..." : "Extend Auction End Times"}
            </button>
          </div>
        </div>
      </div>

      {/* System Status & Architecture Overview */}
      <section className="rounded-2xl border border-border-subtle bg-surface p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-text">System Architecture Health</h3>
            <p className="text-xs text-text-muted">Connected services and security parameters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle space-y-1">
            <span className="text-text-muted font-medium">Database Layer</span>
            <div className="font-bold text-text flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              PostgreSQL / Neon Connected
            </div>
            <div className="text-[10px] text-text-muted">Drizzle ORM with connection pooling</div>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle space-y-1">
            <span className="text-text-muted font-medium">Accounting Engine</span>
            <div className="font-bold text-text flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Strict Double-Entry
            </div>
            <div className="text-[10px] text-text-muted">Debits = Credits Mathematical Invariant</div>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle space-y-1">
            <span className="text-text-muted font-medium">Authentication & RBAC</span>
            <div className="font-bold text-text flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Custom JWT with Jose
            </div>
            <div className="text-[10px] text-text-muted">HttpOnly cookies & middleware guards</div>
          </div>
        </div>
      </section>
    </div>
  );
}
