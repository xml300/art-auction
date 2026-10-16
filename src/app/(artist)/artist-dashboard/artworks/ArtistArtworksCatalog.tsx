"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Artwork } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Palette,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  Flame,
  ArrowUpRight,
  LayoutGrid,
  List,
} from "lucide-react";

interface ArtistArtworksCatalogProps {
  artworks: Artwork[];
}

export default function ArtistArtworksCatalog({ artworks }: ArtistArtworksCatalogProps) {
  const [selectedTab, setSelectedTab] = useState<"all" | "active" | "sold" | "ended">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const now = new Date();

  const isAuctionActive = (art: Artwork) => {
    return art.ownerId === null && new Date(art.auctionEndTime) > now;
  };

  const isAuctionSold = (art: Artwork) => {
    return art.ownerId !== null;
  };

  const isAuctionEnded = (art: Artwork) => {
    return art.ownerId === null && new Date(art.auctionEndTime) <= now;
  };

  const activeArtworks = artworks.filter(isAuctionActive);
  const soldArtworks = artworks.filter(isAuctionSold);
  const endedArtworks = artworks.filter(isAuctionEnded);

  const filteredArtworks = artworks
    .filter((art) => {
      if (selectedTab === "active") return isAuctionActive(art);
      if (selectedTab === "sold") return isAuctionSold(art);
      if (selectedTab === "ended") return isAuctionEnded(art);
      return true;
    })
    .filter((art) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.medium.toLowerCase().includes(q) ||
        art.year.toString().includes(q)
      );
    });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <span className="text-[11px] uppercase tracking-catalog font-medium text-text-muted">
            Studio Inventory
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif italic text-text mt-0.5">
            Artworks Catalog
          </h1>
          <p className="text-xs text-text-muted mt-1 font-light">
            Manage your consigned auction lots, track active bids, and review historic hammer results.
          </p>
        </div>

        <Link
          href="/artist-dashboard/artworks/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-card bg-text hover:bg-text/90 text-background text-xs uppercase tracking-catalog font-semibold shadow-gallery transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Consign New Lot</span>
        </Link>
      </div>

      {/* Controls: Tabs, Search, and View Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-card bg-surface border border-border-subtle overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedTab("all")}
            className={`px-3 py-1.5 rounded-gallery text-xs font-medium whitespace-nowrap transition-colors ${
              selectedTab === "all"
                ? "bg-text text-background shadow-gallery"
                : "text-text-muted hover:text-text hover:bg-surface-elevated"
            }`}
          >
            All Works ({artworks.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab("active")}
            className={`px-3 py-1.5 rounded-gallery text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedTab === "active"
                ? "bg-text text-background shadow-gallery"
                : "text-text-muted hover:text-text hover:bg-surface-elevated"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-accent" />
            <span>Active Auctions ({activeArtworks.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab("sold")}
            className={`px-3 py-1.5 rounded-gallery text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedTab === "sold"
                ? "bg-text text-background shadow-gallery"
                : "text-text-muted hover:text-text hover:bg-surface-elevated"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sold ({soldArtworks.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab("ended")}
            className={`px-3 py-1.5 rounded-gallery text-xs font-medium whitespace-nowrap transition-colors ${
              selectedTab === "ended"
                ? "bg-text text-background shadow-gallery"
                : "text-text-muted hover:text-text hover:bg-surface-elevated"
            }`}
          >
            Ended / Unsold ({endedArtworks.length})
          </button>
        </div>

        {/* Search & View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, medium, year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-card border border-border-subtle bg-surface text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent font-light"
            />
          </div>

          <div className="flex items-center p-1 rounded-card bg-surface border border-border-subtle shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid View"
              className={`p-1.5 rounded-gallery transition-colors ${
                viewMode === "grid"
                  ? "bg-surface-elevated text-text shadow-gallery"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              aria-label="Table View"
              className={`p-1.5 rounded-gallery transition-colors ${
                viewMode === "table"
                  ? "bg-surface-elevated text-text shadow-gallery"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Artworks Content: Empty State, Grid View, or Table View */}
      {filteredArtworks.length === 0 ? (
        <div className="p-12 rounded-card border border-border-subtle bg-surface text-center flex flex-col items-center justify-center shadow-gallery">
          <div className="p-3.5 rounded-card bg-surface-elevated border border-border-subtle text-accent mb-3">
            <Palette className="w-6 h-6" />
          </div>
          <h3 className="font-serif italic text-lg text-text">No Artworks Found</h3>
          <p className="text-xs text-text-muted max-w-sm mt-1 mb-4 font-light">
            {searchQuery
              ? `No artworks matched your search query "${searchQuery}".`
              : "No pieces in this category yet. Consign your next lot to populate your catalog."}
          </p>
          <Link
            href="/artist-dashboard/artworks/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-card bg-text text-background text-xs uppercase tracking-catalog font-semibold transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Consign Artwork</span>
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredArtworks.map((artwork) => {
            const active = isAuctionActive(artwork);
            const sold = isAuctionSold(artwork);
            const ended = isAuctionEnded(artwork);
            const displayPrice = artwork.currentBid && artwork.currentBid > 0
              ? artwork.currentBid
              : artwork.startingBid;

            return (
              <div
                key={artwork.id}
                className="group rounded-card border border-border-subtle bg-surface p-3.5 shadow-gallery hover:shadow-gallery-elevated hover:border-accent/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Museum Matting Aspect 4:5 */}
                <Link
                  href={`/dashboard/marketplace/place-bid/${artwork.id}`}
                  className="relative w-full aspect-[4/5] rounded-gallery overflow-hidden bg-surface-elevated/40 flex items-center justify-center p-2"
                >
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    {active && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-gallery bg-emerald-500/90 text-white text-[10px] uppercase tracking-wider font-semibold backdrop-blur-sm">
                        <Flame className="w-2.5 h-2.5" />
                        Live
                      </span>
                    )}
                    {sold && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-gallery bg-text text-background text-[10px] uppercase tracking-wider font-semibold backdrop-blur-sm">
                        <CheckCircle2 className="w-2.5 h-2.5 text-accent" />
                        Settled
                      </span>
                    )}
                    {ended && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-gallery bg-stone-800 text-stone-200 text-[10px] uppercase tracking-wider font-semibold backdrop-blur-sm">
                        <AlertCircle className="w-2.5 h-2.5" />
                        Ended
                      </span>
                    )}
                  </div>
                </Link>

                {/* Exhibition Placard */}
                <div className="pt-3 pb-1 px-0.5 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <div className="flex items-baseline justify-between text-[10px] uppercase tracking-catalog text-text-muted">
                      <span>Lot #{String(artwork.id).padStart(3, "0")}</span>
                      <span>{artwork.year}</span>
                    </div>

                    <Link href={`/dashboard/marketplace/place-bid/${artwork.id}`}>
                      <h3 className="font-serif italic text-base text-text line-clamp-1 group-hover:text-accent transition-colors mt-0.5">
                        {artwork.title}
                      </h3>
                    </Link>

                    <p className="text-[11px] text-text-muted mt-0.5 font-light">
                      {artwork.medium} &bull; {artwork.dimensions}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-border-subtle flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[9px] uppercase tracking-catalog text-text-muted block">
                        {sold ? "Hammer Price" : "Current Bid"}
                      </span>
                      <span className="font-mono text-xs font-semibold tabular-nums text-text">
                        {formatCurrency(displayPrice)}
                      </span>
                    </div>

                    <Link
                      href={`/dashboard/marketplace/place-bid/${artwork.id}`}
                      className="text-[10px] uppercase tracking-catalog font-semibold text-text hover:text-accent flex items-center gap-0.5 py-1.5 px-2.5 rounded-card bg-surface-elevated border border-border-subtle hover:border-accent/40 transition-colors"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High-Density Table View */
        <div className="overflow-x-auto rounded-card border border-border-subtle bg-surface shadow-gallery">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-elevated text-text-muted uppercase text-[10px] tracking-catalog font-medium border-b border-border-subtle">
              <tr>
                <th scope="col" className="px-5 py-3">Lot & Preview</th>
                <th scope="col" className="px-5 py-3">Title & Medium</th>
                <th scope="col" className="px-5 py-3">Status</th>
                <th scope="col" className="px-5 py-3 text-right">Current / Final</th>
                <th scope="col" className="px-5 py-3 text-right">Auction Timeline</th>
                <th scope="col" className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredArtworks.map((artwork) => {
                const active = isAuctionActive(artwork);
                const sold = isAuctionSold(artwork);
                const ended = isAuctionEnded(artwork);
                const displayPrice = artwork.currentBid && artwork.currentBid > 0
                  ? artwork.currentBid
                  : artwork.startingBid;

                return (
                  <tr key={artwork.id} className="hover:bg-surface-elevated/40 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded-gallery overflow-hidden bg-surface-elevated shrink-0 border border-border-subtle">
                          <Image
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            fill
                            className="object-contain p-0.5"
                          />
                        </div>
                        <span className="font-mono text-xs text-text-muted">
                          #{String(artwork.id).padStart(3, "0")}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-serif italic font-medium text-text text-sm">{artwork.title}</div>
                      <div className="text-[11px] text-text-muted font-light">
                        {artwork.medium} ({artwork.year}) &bull; {artwork.dimensions}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {active && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-gallery bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-semibold tracking-wider">
                          <Flame className="w-3 h-3 text-accent" />
                          Live Auction
                        </span>
                      )}
                      {sold && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-gallery bg-text text-background text-[10px] uppercase font-semibold tracking-wider">
                          <CheckCircle2 className="w-3 h-3 text-accent" />
                          Sold & Settled
                        </span>
                      )}
                      {ended && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-gallery bg-surface-elevated text-text-muted border border-border-subtle text-[10px] uppercase font-semibold tracking-wider">
                          <AlertCircle className="w-3 h-3" />
                          Ended
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-semibold tabular-nums text-text">
                      {formatCurrency(displayPrice)}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-[11px] text-text-muted tabular-nums">
                      {new Date(artwork.auctionEndTime).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/dashboard/marketplace/place-bid/${artwork.id}`}
                        className="inline-flex items-center gap-1 text-[11px] uppercase tracking-catalog font-semibold text-text hover:text-accent transition-colors"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
