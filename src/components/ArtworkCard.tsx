"use client";

import Link from "next/link";
import Image from "next/image";
import { Artwork } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ArtworkCardProps {
  artwork: Artwork;
  index?: number;
  owned?: boolean;
  customHref?: string;
}

export default function ArtworkCard({ artwork, index = 0, owned, customHref }: ArtworkCardProps) {
  const isMarketplace = owned === false;
  const targetHref = customHref || (isMarketplace
    ? `/dashboard/marketplace/place-bid/${artwork.id}`
    : `/dashboard/my-artworks/${artwork.id}`);

  const displayPrice = artwork.currentBid && artwork.currentBid > 0
    ? artwork.currentBid
    : artwork.startingBid;

  return (
    <div
      className="group rounded-2xl border border-border-subtle bg-surface overflow-hidden shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-surface-elevated">
        <Image
          src={artwork.imageUrl}
          width={600}
          height={600}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/10">
          {artwork.title}
        </div>
        {displayPrice > 0 && (
          <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
            {formatCurrency(displayPrice)}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-text text-base line-clamp-1 group-hover:text-primary transition-colors">
              {artwork.title}
            </h3>
          </div>
          {artwork.description && (
            <p className="text-xs text-text-muted line-clamp-2 mt-1">
              {artwork.description}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted block">
              {isMarketplace ? "Current Bid" : "Estimated Value"}
            </span>
            <span className="text-sm font-bold text-text">
              {formatCurrency(displayPrice)}
            </span>
          </div>

          <Link
            href={targetHref}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors shadow-xs"
          >
            {isMarketplace ? "Place Bid" : "Details"}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
