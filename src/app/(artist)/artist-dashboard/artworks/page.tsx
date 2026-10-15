import { getArtistProfile } from "@/data/queries";
import { getSession } from "@/lib/auth";
import EmptyState from "@/components/EmptyState";
import ArtistArtworksCatalog from "./ArtistArtworksCatalog";

export const metadata = {
  title: "Artworks Catalog | Artsyl Artist Studio",
  description: "Browse, filter, and manage your artwork listings and auction lots",
};

export default async function ArtistArtworksPage() {
  const [session] = await getSession();
  const profile = await getArtistProfile(session?.userId || null);

  if (!profile) {
    return (
      <EmptyState
        title="Profile Not Found"
        message="Could not load your artist catalog. Please try logging in again."
        iconSrc="/icons/user.svg"
      />
    );
  }

  return <ArtistArtworksCatalog artworks={profile.allArtworks} />;
}
