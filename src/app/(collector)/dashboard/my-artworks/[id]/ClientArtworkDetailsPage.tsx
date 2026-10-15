"use client";

import Image from "next/image";
import { useState } from "react";
import { Artwork, User } from "@/types";
import { FaRegUserCircle } from "react-icons/fa";
import ArtworkCard from "@/components/ArtworkCard";

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

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-2xl border border-border-subtle shadow-xs overflow-hidden">
              <div className="relative w-full h-80 sm:h-96 bg-surface-elevated">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
                  {artwork.title}
                </h1>
                <div className="flex items-center text-text-muted text-xs sm:text-sm gap-2">
                  <FaRegUserCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>{artist ? artist.username : "Verified Artist"}</span>
                </div>
                {artwork.description && (
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {artwork.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface rounded-2xl border border-border-subtle shadow-xs p-6 space-y-4">
              <h3 className="text-lg font-bold tracking-tight text-text">Actions</h3>
              <div className="space-y-2.5">
                <button
                  type="button"
                  className="w-full bg-surface-elevated hover:bg-secondary text-text border border-border-subtle font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all shadow-xs active:scale-[0.98]"
                >
                  View Certificate
                </button>
                {artwork.ownerId != null && (
                  <button
                    type="button"
                    className="w-full bg-primary hover:bg-primary-hover text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all shadow-xs active:scale-[0.98]"
                  >
                    List for Resale
                  </button>
                )}
                <button
                  type="button"
                  className="w-full bg-surface-elevated hover:bg-secondary text-text border border-border-subtle font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all shadow-xs active:scale-[0.98]"
                >
                  Transfer Ownership
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-6">
            <span className="text-xs uppercase font-bold tracking-wider text-primary">
              Curated Recommendations
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text mt-1">
              Related Artworks
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
              <p className="text-xs text-text-muted col-span-full">No related artworks found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
