import Link from 'next/link';
import Image from 'next/image';

interface Artwork {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
}

interface ArtworkCardProps {
    artwork: Artwork;
    index: number;
}

export function ArtworkCard({ artwork, index }: ArtworkCardProps) {
    return (
        <Link
            href={`/dashboard/my-artworks/${artwork.id}`}
            key={artwork.id}
            className="w-full cursor-pointer rounded-lg overflow-hidden shadow-lg border hover:scale-105 transition-transform duration-300 relative group"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <Image src={artwork.imageUrl} alt={artwork.title} className="bg-black/60 h-56 sm:h-64 lg:h-72 w-full object-cover" />
            <div className="p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2">{artwork.title}</h3>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-600 dark:text-gray-300">{artwork.description}</p>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-lg font-bold">View Details</span>
            </div>
        </Link>
    );
}
