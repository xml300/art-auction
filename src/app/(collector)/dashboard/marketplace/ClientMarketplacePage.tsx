"use client";

import React, { useEffect, useState, useRef } from "react";
import { ListFilter, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import { MarketplaceGrid } from "@/components/MarketplaceGrid";
import { Artwork } from "@/types";
import { api } from "@/lib/api";
import { ArtworkCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

export default function ClientMarketplacePage({
  initialArtworks,
  initialTotalPages,
  pageLimit,
}: {
  initialArtworks: Artwork[];
  initialTotalPages: number;
  pageLimit: number;
}) {
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>(initialArtworks);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const [searchFilter, setSearchFilter] = useState("");
  const [artistName, setArtistName] = useState("");
  const [minBid, setMinBid] = useState("");
  const [maxBid, setMaxBid] = useState("");
  const [minEndTime, setMinEndTime] = useState("");
  const [maxEndTime, setMaxEndTime] = useState("");

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const fetchArtworks = async () => {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageLimit.toString(),
      });

      if (searchFilter) params.set("searchQuery", searchFilter);
      if (artistName) params.set("artistName", artistName);
      if (minBid) params.set("minBid", minBid);
      if (maxBid) params.set("maxBid", maxBid);
      if (minEndTime) params.set("minEndTime", Date.parse(minEndTime).toString());
      if (maxEndTime) params.set("maxEndTime", Date.parse(maxEndTime).toString());

      try {
        const res = await api.get<{ artworks: Artwork[]; totalPages: number }>(
          `/artworks/marketplace?${params.toString()}`
        );
        setFilteredArtworks(res.artworks);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error("Failed to load artworks", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchArtworks, 300);
    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchFilter, artistName, minBid, maxBid, minEndTime, maxEndTime, pageLimit]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setArtistName("");
    setMinBid("");
    setMaxBid("");
    setMinEndTime("");
    setMaxEndTime("");
    setIsFilterMenuOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Marketplace</h1>
          <p className="text-xs text-text-muted mt-1">Discover, bid on, and collect authentic digital works</p>
        </div>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="search"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full rounded-xl border border-border-subtle bg-surface text-text text-sm py-2.5 pl-10 pr-4 placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150"
            placeholder="Search artworks by title..."
          />
        </div>

        <div className="relative">
          <Button
            variant={isFilterMenuOpen ? "primary" : "secondary"}
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            leftIcon={<ListFilter className="w-4 h-4" />}
          >
            Filters
          </Button>

          {/* Filter Popover */}
          {isFilterMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-surface border border-border-subtle shadow-2xl p-5 z-50 animate-scale-in text-left space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="font-semibold text-sm text-text">Refine Results</span>
                <button
                  onClick={() => setIsFilterMenuOpen(false)}
                  className="p-1 rounded-lg text-text-muted hover:text-text"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full rounded-xl border border-border-subtle bg-surface-elevated text-text text-sm p-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Bid Range (₦)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={minBid}
                      onChange={(e) => setMinBid(e.target.value)}
                      placeholder="Min"
                      className="w-full rounded-xl border border-border-subtle bg-surface-elevated text-text text-sm p-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      type="number"
                      value={maxBid}
                      onChange={(e) => setMaxBid(e.target.value)}
                      placeholder="Max"
                      className="w-full rounded-xl border border-border-subtle bg-surface-elevated text-text text-sm p-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Auction End Date
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={minEndTime}
                      onChange={(e) => setMinEndTime(e.target.value)}
                      className="w-full rounded-xl border border-border-subtle bg-surface-elevated text-text text-xs p-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      type="date"
                      value={maxEndTime}
                      onChange={(e) => setMaxEndTime(e.target.value)}
                      className="w-full rounded-xl border border-border-subtle bg-surface-elevated text-text text-xs p-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border-subtle flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsFilterMenuOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid Content with Skeleton Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ArtworkCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <MarketplaceGrid artworks={filteredArtworks} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center sm:justify-end pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
