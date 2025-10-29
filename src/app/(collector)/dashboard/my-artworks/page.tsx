import { ArtworkCarousel } from "@/components/ArtworksCarousel";
import PaginatedArtworks from "@/components/PaginatedArtworks";
import { getArtworks } from "@/data/db";

export default function MyArtworksPage() {
    const artworks = getArtworks();

    return (
        <div className="space-y-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold animate-fade-in">My Artworks</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 animate-fade-in-delay-1">Explore and manage your personal collection of digital art.</p>

            <div className="animate-fade-in-delay-1 !mb-36">
                <ArtworkCarousel artworks={artworks} />
            </div>

           <div className="mt-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold animate-fade-in">All Artworks</h2>
                <p className="text-md text-gray-600 dark:text-gray-300 animate-fade-in-delay-1">Browse through your entire collection.</p>
            </div>
            <PaginatedArtworks artworks={artworks} />
        </div>
    );
}
