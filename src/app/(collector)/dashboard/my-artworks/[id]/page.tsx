import { Artwork, User } from '@/types';
import { api } from '@/lib/api';
import ClientArtworkDetailsPage from './ClientArtworkDetailsPage';

export const dynamic = "force-dynamic";
interface ArtworkResponse {
    artwork: Artwork & {
        artist: User;
        relatedWorks: Artwork[];
    };
}

export default async function ArtworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const artworkResponse = await api.get<ArtworkResponse>(`/artworks/${id}?artist=true&relatedWorks=true`)
    const artwork = artworkResponse.artwork;
 

    if (!artwork) {
        return <div className="text-center text-xl mt-12">Artwork not found.</div>;
    }

    return (
        <ClientArtworkDetailsPage artwork={artwork} />
    );
}
