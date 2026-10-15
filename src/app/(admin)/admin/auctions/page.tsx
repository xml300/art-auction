"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import {
  Gavel,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface AdminArtwork {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  startingBid: number;
  currentBid: number | null;
  auctionEndTime: string;
  artistId: number;
  ownerId: number | null;
  medium: string;
  year: number;
  artist: {
    id: number;
    username: string;
    email: string;
  };
  isActive: boolean;
  isExpired: boolean;
  isSettled: boolean;
}

export default function AdminAuctionsPage() {
  const [artworks, setArtworks] = useState<AdminArtwork[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending_settlement" | "settled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettling, setIsSettling] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchArtworks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        page: String(page),
        limit: "20",
      });
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      const res = await fetch(`/api/admin/auctions?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setArtworks(data.artworks);
        setTotalCount(data.totalCount);
      }
    } catch {
      setActionMessage({ text: "Failed to fetch artworks", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery, page]);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  const handleSettleAll = async () => {
    setIsSettling(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/auctions/settle", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({
          text: `Settlement run complete: ${data.settledCount ?? 0} auction(s) settled.`,
          type: "success",
        });
        fetchArtworks();
      } else {
        setActionMessage({
          text: data.error || "Failed to settle auctions.",
          type: "error",
        });
      }
    } catch {
      setActionMessage({
        text: "Network error during settlement run.",
        type: "error",
      });
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-primary">
            Catalog Governance
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-text">
            Auctions & Artwork Moderation
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Monitor live lots, verify ending times, and settle expired auctions{totalCount > 0 ? ` (${totalCount} total lots)` : ""}.
          </p>
        </div>

        <button
          onClick={handleSettleAll}
          disabled={isSettling}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
        >
          {isSettling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Gavel className="w-4 h-4" />
          )}
          {isSettling ? "Settling..." : "Settle Expired Lots"}
        </button>
      </div>

      {actionMessage && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in ${
            actionMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
          }`}
        >
          {actionMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface p-3 rounded-2xl border border-border-subtle">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(
            [
              { id: "all", label: "All Works" },
              { id: "active", label: "Active" },
              { id: "pending_settlement", label: "Pending Settlement" },
              { id: "settled", label: "Settled / Sold" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text hover:bg-surface-elevated"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by artwork title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text focus:outline-hidden focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Artworks Table */}
      <div className="rounded-2xl border border-border-subtle bg-surface overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-text-muted">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs">Loading artworks catalog...</span>
          </div>
        ) : artworks.length === 0 ? (
          <div className="p-12 text-center text-text-muted text-xs">
            No artworks found matching the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-elevated/40 text-text-muted font-semibold">
                  <th className="py-3 px-4">Artwork</th>
                  <th className="py-3 px-4">Artist</th>
                  <th className="py-3 px-4">Current / Start Bid</th>
                  <th className="py-3 px-4">Auction End Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {artworks.map((art) => {
                  const end = new Date(art.auctionEndTime);

                  return (
                    <tr key={art.id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-surface-elevated shrink-0 border border-border-subtle">
                            {art.imageUrl ? (
                              <Image
                                src={art.imageUrl}
                                alt={art.title}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-text-muted">
                                🎨
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-text line-clamp-1">{art.title}</div>
                            <div className="text-[11px] text-text-muted">
                              {art.medium} · {art.year}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-text">{art.artist?.username}</div>
                        <div className="text-[11px] text-text-muted">{art.artist?.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-text">
                          {formatCurrency(art.currentBid || art.startingBid)}
                        </div>
                        <div className="text-[11px] text-text-muted">
                          Start: {formatCurrency(art.startingBid)}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-text font-medium">
                          {end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                        <div className="text-[11px] text-text-muted">
                          {end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {art.isSettled ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                            Settled
                          </span>
                        ) : art.isExpired ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Pending Settlement
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`/dashboard/marketplace`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                        >
                          View Lot
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
