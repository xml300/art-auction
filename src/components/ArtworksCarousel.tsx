"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Artwork } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function ArtworkCarousel({
  artworks,
  className = "",
}: {
  artworks: Artwork[];
  className?: string;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!artworks || artworks.length === 0) return null;

  return (
    <section className={`relative my-6 w-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-primary">
            Curated Showcase
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
            Featured Masterpieces
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label="Previous artwork"
            className="p-2 rounded-xl border border-border-subtle bg-surface text-text hover:bg-surface-elevated transition-colors shadow-xs active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Next artwork"
            className="p-2 rounded-xl border border-border-subtle bg-surface text-text hover:bg-surface-elevated transition-colors shadow-xs active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {artworks.map((artwork) => {
          const price = (artwork.currentBid && artwork.currentBid > 0)
            ? artwork.currentBid
            : artwork.startingBid;

          return (
            <div
              key={artwork.id}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] max-w-[360px] snap-start shrink-0 rounded-2xl border border-border-subtle bg-surface overflow-hidden shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-surface-elevated">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
                  {formatCurrency(price)}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-text text-base line-clamp-1 group-hover:text-primary transition-colors">
                    {artwork.title}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-2 mt-1">
                    {artwork.description || "Exclusive digital lot available on Artsyl"}
                  </p>
                </div>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted block">
                      Current Bid
                    </span>
                    <span className="text-sm font-bold text-text">
                      {formatCurrency(price)}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/marketplace/place-bid/${artwork.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors shadow-xs"
                  >
                    Bid Now
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}