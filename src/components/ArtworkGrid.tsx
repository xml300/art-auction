import EmptyState from "./EmptyState";
import ArtworkCard from "./ArtworkCard";
import { Artwork } from "@/types";


interface ArtworkGridProps {
    artworks: Artwork[];
    emptyMessage: string;
    baseUrl?: string;
}

export default function ArtworkGrid({ artworks, emptyMessage }: ArtworkGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 3xl:grid-cols-4 gap-4 sm:gap-6">
            {artworks.map((artwork, index) => (
                <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    index={index}
                />
            ))}
            {artworks.length === 0 && (
                <EmptyState title="No Artworks" message={emptyMessage} />
            )}
        </div>
    );
}
