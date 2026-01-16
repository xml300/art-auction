import { ArtworkCarousel } from "@/components/ArtworksCarousel";
import PaginatedArtworks from "@/components/PaginatedArtworks";
import { getArtworks } from "@/data/queries";
import EmptyState from "@/components/EmptyState";
import { getSession } from "@/lib/auth";

export default async function MyArtworksPage() {
    const [session, error] = await getSession();
    if (error || session === null) {
        return (
            <div className="space-y-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold animate-fade-in">My Artworks</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 animate-fade-in-delay-1">Explore and manage your personal collection of digital art.</p>
                <EmptyState
                    title="Not Logged In"
                    message="Please log in to view your artworks."
                    iconSrc="/globe.svg" // Assuming you have an appropriate icon
                />
            </div>
        );
    }
    const artworks = await getArtworks(session?.userId);

    return (
        <div className="space-y-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold animate-fade-in">My Artworks</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 animate-fade-in-delay-1">Explore and manage your personal collection of digital art.</p>

            {artworks.length === 0 ? (
                <EmptyState
                    title="No Artworks Yet"
                    message="It looks like you haven't added any artworks to your collection. Start exploring the marketplace to find your next masterpiece!"
                    iconSrc="/globe.svg" // Assuming you have an appropriate icon
                />
            ) : (
                <>
                    <div className="animate-fade-in-delay-1 !mb-36">
                        <ArtworkCarousel artworks={artworks} />
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold animate-fade-in">All Artworks</h2>
                        <p className="text-md text-gray-600 dark:text-gray-300 animate-fade-in-delay-1">Browse through your entire collection.</p>
                    </div>
                    <PaginatedArtworks artworks={artworks} />
                </>
            )}
        </div>
    );
}
