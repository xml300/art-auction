import Link from "next/link";
import Image from "next/image";

interface ArtworkSummary {
    id: string;
    title: string;
    imageUrl: string;
}

interface ArtworkGridProps {
    artworks: ArtworkSummary[];
    emptyMessage: string;
    baseUrl: string;
}

export default function ArtworkGrid({ artworks, emptyMessage, baseUrl }: ArtworkGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {artworks.map(artwork => (
                <Link href={`${baseUrl}/${artwork.id}`} key={artwork.id} className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">{artwork.title}</h3>
                    </div>
                </Link>
            ))}
            {artworks.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">{emptyMessage}</p>
            )}
        </div>
    );
}
