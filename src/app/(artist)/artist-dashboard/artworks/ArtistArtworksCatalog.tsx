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
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
  ArrowUpRight,
  Gavel,
} from "lucide-react";

interface ArtistArtworksCatalogProps {
  artworks: Artwork[];
}

export default function ArtistArtworksCatalog({ artworks }: ArtistArtworksCatalogProps) {
  const [selectedTab, setSelectedTab] = useState<"all" | "active" | "sold" | "ended">("all");
  const [searchQuery, setSearchQuery] = useState("");

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
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
            My Artworks Catalog
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Manage your artwork listings, monitor live lots, and review past auction results.
          </p>
        </div>

        <Link
          href="/artist-dashboard/artworks/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary-hover shadow-xs transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          List New Artwork
        </Link>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border-subtle overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTab === "all"
                ? "bg-primary text-white shadow-xs"
                : "text-text-muted hover:text-text hover:bg-surface-elevated"
            }`}
          >
            All Works ({artworks.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedTab === "active"
                ? "bg-primary text-white shadow-xs"
                : "text-text-muted hover:text-text hover:bg-surface-elevated"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Active Auctions ({activeArtworks.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab("sold")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedTab === "sold"
                ? "bg-primary text-white shadow-xs"
                : "text-text-muted hover:text-text hover:bg-surface-elevated"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Sold ({soldArtworks.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab("ended")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTab === "ended"
                ? "bg-primary text-white shadow-xs"
                : "text-text-muted hover:text-text hover:bg-surface-elevated"
            }`}
          >
            Ended / Unsold ({endedArtworks.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-border-subtle bg-surface text-text placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Grid of Artworks */}
      {filteredArtworks.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-border-subtle bg-surface text-center flex flex-col items-center justify-center">
          <div className="p-3.5 rounded-2xl bg-primary/10 text-primary mb-3">
            <Palette className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-text">No Artworks Found</h3>
          <p className="text-xs text-text-muted max-w-sm mt-1 mb-4">
            {searchQuery
              ? `No artworks matched your search query "${searchQuery}".`
              : "No pieces in this category yet. List your next masterpiece to populate your gallery."}
          </p>
          <Link
            href="/artist-dashboard/artworks/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            List Artwork
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredArtworks.map((artwork) => {
            const active = isAuctionActive(artwork);
            const sold = isAuctionSold(artwork);
            const ended = isAuctionEnded(artwork);

            return (
              <div
                key={artwork.id}
                className="group rounded-2xl border border-border-subtle bg-surface overflow-hidden shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between"
              >
                {/* Image & Status Badge */}
                <div className="relative w-full h-52 overflow-hidden bg-surface-elevated">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    width={500}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Status Tag */}
                  <div className="absolute top-2.5 left-2.5">
                    {active && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[11px] font-semibold backdrop-blur-xs shadow-xs">
                        <Flame className="w-3 h-3 text-amber-200" />
                        Live Auction
                      </span>
                    )}
                    {sold && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/90 text-white text-[11px] font-semibold backdrop-blur-xs shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                        Sold & Settled
                      </span>
                    )}
                    {ended && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800/90 text-white text-[11px] font-semibold backdrop-blur-xs shadow-xs">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        Auction Ended
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/10">
                    {formatCurrency(
                      artwork.currentBid && artwork.currentBid > 0
                        ? artwork.currentBid
                        : artwork.startingBid
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-sm text-text line-clamp-1 group-hover:text-primary transition-colors">
                      {artwork.title}
                    </h3>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {artwork.medium} &bull; {artwork.dimensions} ({artwork.year})
                    </p>
                    {artwork.description && (
                      <p className="text-xs text-text-muted line-clamp-2 mt-2 leading-relaxed">
                        {artwork.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-text-muted text-[11px]">
                      <Clock className="w-3 h-3 text-text-muted" />
                      <span>
                        {active
                          ? `Ends ${new Date(artwork.auctionEndTime).toLocaleDateString()}`
                          : `Ended ${new Date(artwork.auctionEndTime).toLocaleDateString()}`}
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold text-primary inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      {active ? "Live Lot" : "Archived"}
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
