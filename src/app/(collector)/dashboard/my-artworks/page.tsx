import { ArtworkCarousel } from "@/components/ArtworksCarousel";
import PaginatedArtworks from "@/components/PaginatedArtworks";
import { getArtworks } from "@/data/queries";
import EmptyState from "@/components/EmptyState";
import { getSession } from "@/lib/auth";

export default async function MyArtworksPage() {
  const [session] = await getSession();
  const artworks = await getArtworks(session!.userId);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">My Artworks</h1>
        <p className="text-xs text-text-muted mt-1">
          Explore and manage your personal collection of digital art.
        </p>
      </div>

      {artworks.length === 0 ? (
        <EmptyState
          title="No Artworks Yet"
          message="You haven't acquired any artworks yet. Explore active auctions in the marketplace to place your first bid!"
          iconSrc="/globe.svg"
        />
      ) : (
        <>
          <ArtworkCarousel artworks={artworks} />

          <div className="pt-6 border-t border-border-subtle">
            <div className="mb-4">
              <h2 className="text-lg font-bold tracking-tight text-text">
                All Acquired Pieces
              </h2>
              <p className="text-xs text-text-muted">
                Complete catalog of your authenticated digital collection
              </p>
            </div>
            <PaginatedArtworks artworks={artworks} />
          </div>
        </>
      )}
    </div>
  );
}
