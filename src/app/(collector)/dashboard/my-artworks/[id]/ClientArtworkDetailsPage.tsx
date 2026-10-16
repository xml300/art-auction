"use client";

import { useState } from "react";
import Link from "next/link";
import { Artwork, User } from "@/types";
import { UserCircle, ShieldCheck, FileText, ArrowLeft, ArrowUpRight } from "lucide-react";
import ArtworkCard from "@/components/ArtworkCard";
import { ArtworkViewer } from "@/app/(collector)/dashboard/marketplace/place-bid/[id]/ArtworkViewer";
import { formatCurrency } from "@/lib/utils";

export default function ClientArtworkDetailsPage({
  artwork,
}: {
  artwork: Artwork & {
    artist: User;
    relatedWorks: Artwork[];
  };
}) {
  const [artist] = useState<User>(artwork.artist);
  const [relatedArtworks] = useState<Artwork[]>(artwork.relatedWorks);

  const acquisitionPrice = artwork.currentBid && artwork.currentBid > 0
    ? artwork.currentBid
    : artwork.startingBid;

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <Link
            href="/dashboard/my-artworks"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-catalog font-semibold text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Vault</span>
          </Link>
          <span className="font-mono text-xs text-text-muted tabular-nums">
            Lot #{String(artwork.id).padStart(3, "0")}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Inspection Canvas */}
          <div className="lg:col-span-2 space-y-6">
            <ArtworkViewer
              imageUrl={artwork.imageUrl}
              title={artwork.title}
              artistName={artist?.username}
            />

            {/* Curatorial Provenance Placard */}
            <div className="p-6 bg-surface rounded-card border border-border-subtle shadow-gallery space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-catalog font-medium text-text-muted">
                  Artwork Dossier
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif italic text-text">
                  {artwork.title}
                </h1>
              </div>

              <div className="flex items-center text-text-muted text-xs gap-2 pt-1 border-t border-border-subtle">
                <UserCircle className="w-4 h-4 text-accent shrink-0" />
                <span className="font-medium text-text">{artist ? artist.username : "Consigned Artist"}</span>
                <span>&bull;</span>
                <span>Created {artwork.year}</span>
                <span>&bull;</span>
                <span>{artwork.medium}</span>
              </div>

              {artwork.description && (
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-light pt-2">
                  {artwork.description}
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border-subtle text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-catalog text-text-muted block">Medium</span>
                  <span className="font-medium text-text">{artwork.medium}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-catalog text-text-muted block">Dimensions</span>
                  <span className="font-medium text-text">{artwork.dimensions}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-catalog text-text-muted block">Year</span>
                  <span className="font-medium text-text">{artwork.year}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ownership & Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-surface rounded-card border border-border-subtle shadow-gallery p-6 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-catalog text-accent font-semibold block">
                  Ownership Status
                </span>
                <div className="flex items-center gap-2 text-text font-serif italic text-xl">
                  <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
                  <span>Authenticated Vault Lot</span>
                </div>
              </div>

              <div className="p-3.5 bg-surface-elevated/50 rounded-gallery border border-border-subtle space-y-1">
                <span className="text-[10px] uppercase tracking-catalog text-text-muted block">
                  Acquisition Value
                </span>
                <span className="text-2xl font-mono font-bold tabular-nums text-text">
                  {formatCurrency(acquisitionPrice)}
                </span>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 bg-surface-elevated hover:bg-secondary text-text border border-border-subtle font-semibold text-xs py-2.5 px-4 rounded-card transition-all active:scale-[0.98]"
                >
                  <FileText className="w-3.5 h-3.5 text-text-muted" />
                  <span>Certificate of Authenticity</span>
                </button>
                {artwork.ownerId != null && (
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 bg-text hover:bg-text/90 text-background font-semibold text-xs py-2.5 px-4 rounded-card transition-all active:scale-[0.98]"
                  >
                    <span>List for Secondary Auction</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  className="w-full bg-surface-elevated hover:bg-secondary text-text border border-border-subtle font-semibold text-xs py-2.5 px-4 rounded-card transition-all active:scale-[0.98]"
                >
                  Transfer Custody
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Curated Recommendations */}
        <div className="pt-8 border-t border-border-subtle">
          <div className="mb-6">
            <span className="text-[11px] uppercase tracking-catalog font-medium text-text-muted">
              Curated Recommendations
            </span>
            <h2 className="text-xl sm:text-2xl font-serif italic text-text mt-0.5">
              Related Masterpieces
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedArtworks.length > 0 ? (
              relatedArtworks.map((relatedArtwork, index) => (
                <ArtworkCard
                  key={relatedArtwork.id}
                  artwork={relatedArtwork}
                  index={index}
                  owned={relatedArtwork.ownerId === artwork?.ownerId}
                />
              ))
            ) : (
              <p className="text-xs text-text-muted col-span-full font-light">No related artworks found in gallery catalogue.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
