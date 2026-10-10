import { Artwork } from "@/types";
import EmptyState from "./EmptyState";
import ArtworkCard from "./ArtworkCard";

export function MarketplaceGrid({
  artworks,
  numArtworks,
}: {
  artworks: Artwork[];
  numArtworks?: number;
}) {
  const displayArtworks = numArtworks ? artworks.slice(0, numArtworks) : artworks;

  if (displayArtworks.length === 0) {
    return (
      <EmptyState
        title="No Artworks Found"
        message="Try adjusting your search or filters to discover active auction lots."
      />
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayArtworks.map((artwork, index) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          index={index}
          owned={false}
        />
      ))}
    </section>
  );
}
