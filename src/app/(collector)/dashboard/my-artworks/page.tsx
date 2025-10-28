import { ArtworkCarousel } from "@/components/ArtworksCarousel";
import { ArtworkCard } from "@/components/ArtworkCard";
import { getArtworks } from "@/data/db";

export default function MyArtworksPage() {
    const artworks = getArtworks();

    return (
        <div className="space-y-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold animate-fade-in">My Artworks</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 animate-fade-in-delay-1">Explore and manage your personal collection of digital art.</p>

            <div className="animate-fade-in-delay-1">
                <ArtworkCarousel artworks={artworks} />
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in-delay-2">
                {artworks.map((artwork, index) => (
                    <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
                ))}
            </section>
        </div>
    );
}
