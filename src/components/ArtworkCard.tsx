"use client";

import Link from "next/link";
import Image from "next/image";
import { Artwork } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ArtworkCardProps {
  artwork: Artwork & {
    artist?: {
      username?: string;
    } | null;
  };
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
      className="group flex flex-col bg-surface border border-border-subtle p-3.5 transition-all duration-300 hover:border-accent/40 rounded-card shadow-gallery hover:shadow-gallery-elevated"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Sacred Canvas Framing: 4:5 Aspect Ratio, object-contain, zero overlay pills */}
      <Link href={targetHref} className="relative w-full aspect-[4/5] bg-surface-elevated/40 flex items-center justify-center p-3 overflow-hidden rounded-gallery">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </Link>

      {/* Exhibition Placard Below Art */}
      <div className="pt-3.5 pb-1 px-1 flex flex-col gap-2 flex-1 justify-between">
        <div>
          <div className="flex items-baseline justify-between text-[11px] uppercase tracking-catalog text-text-muted">
            <span className="font-medium truncate max-w-[160px]">{artwork.artist?.username || "Consigned Lot"}</span>
            <span className="font-mono tabular-nums">Lot #{String(artwork.id).padStart(3, '0')}</span>
          </div>

          <Link href={targetHref}>
            <h3 className="font-serif italic text-base sm:text-lg text-text line-clamp-1 group-hover:text-accent transition-colors mt-0.5">
              {artwork.title}
            </h3>
          </Link>
          {artwork.description && (
            <p className="text-xs text-text-muted line-clamp-2 mt-1 font-light leading-relaxed">
              {artwork.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
          <div>
            <span className="block text-[10px] uppercase tracking-catalog text-text-muted font-medium">
              {isMarketplace ? "Current Estimate" : "Acquisition Value"}
            </span>
            <span className="font-mono text-sm sm:text-base font-semibold tabular-nums text-text">
              {formatCurrency(displayPrice)}
            </span>
          </div>

          <Link
            href={targetHref}
            className="text-[11px] uppercase tracking-catalog font-semibold text-text hover:text-accent transition-colors flex items-center gap-1 group/btn py-2 px-3 rounded-card bg-surface-elevated border border-border-subtle hover:border-accent/40"
          >
            <span>{isMarketplace ? "Bid" : "View"}</span>
            <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
