import EmptyState from "./EmptyState";
import ArtworkCard from "./ArtworkCard";
import { Artwork } from "@/types";

interface ArtworkGridProps {
  artworks: Artwork[];
  emptyMessage: string;
  baseUrl?: string;
}

export default function ArtworkGrid({ artworks, emptyMessage }: ArtworkGridProps) {
  if (artworks.length === 0) {
    return <EmptyState title="No Artworks" message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {artworks.map((artwork, index) => (
        <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
      ))}
    </div>
  );
}
