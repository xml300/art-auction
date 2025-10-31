import Link from 'next/link';
import Image from 'next/image';
import { Artwork } from '@/data/db';

interface ArtworkCardProps {
    artwork: Artwork;
    index: number;
    owned?: boolean;
}

export default function ArtworkCard({ artwork, index, owned }: ArtworkCardProps) {
    return (
        <Link
            href={(owned || owned===undefined) ? `/dashboard/my-artworks/${artwork.id}` : `/dashboard/marketplace/place-bid/${artwork.id}`}
            key={artwork.id}
            className="w-full h-96 cursor-pointer rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 relative group"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="relative w-full h-full overflow-hidden">
                <Image src={artwork.imageUrl} width={800} height={800} alt={artwork.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full group-hover:opacity-0 transition-opacity duration-300">
                    {artwork.title}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm text-center mb-4 line-clamp-3">{artwork.description}</p>
                    <span className="text-white text-lg font-bold">View Details</span>
                </div>
            </div>
        </Link>
    );
}
