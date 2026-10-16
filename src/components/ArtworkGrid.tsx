import EmptyState from "./EmptyState";
import ArtworkCard from "./ArtworkCard";
import { Artwork } from "@/types";

interface ArtworkGridProps {
  artworks: Artwork[];
  emptyMessage: string;
  baseUrl?: string;
}

export default function ArtworkGrid({ artworks, emptyMessage, baseUrl }: ArtworkGridProps) {
  if (artworks.length === 0) {
    return <EmptyState title="No Artworks" message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {artworks.map((artwork, index) => {
        const isMarketplace = baseUrl ? baseUrl.includes("marketplace") : false;
        const customHref = baseUrl
          ? (isMarketplace ? `${baseUrl}/place-bid/${artwork.id}` : `${baseUrl}/${artwork.id}`)
          : undefined;

        return (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            index={index}
            owned={!isMarketplace}
            customHref={customHref}
          />
        );
      })}
    </div>
  );
}
