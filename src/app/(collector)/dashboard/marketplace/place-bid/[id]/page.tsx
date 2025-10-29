import { getArtworkById } from '@/data/db';
import { PlaceBidForm } from './PlaceBidForm';

import Image from 'next/image';

export default async function PlaceBidPage({params}: {params: Promise<{id: string}>}) {
    const id = parseInt((await params).id); 
    const artwork = getArtworkById(id);

    return (
        <div className="container mx-auto p-6 dark:bg-dark-background dark:text-dark-text">
            <h1 className="text-4xl font-bold mb-8">Place Your Bid</h1>

            <div className="flex flex-col xl:flex-row gap-8 w-full">
                {/* Artwork Details Section */}
                <div className="xl:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        width={800}
                        height={800}
                        className="w-full h-64 md:h-72 xl:h-96 object-cover rounded-lg mb-6"
                    />
                    <h2 className="text-3xl font-semibold mb-2">{artwork.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{artwork.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-lg">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Artist</p>
                            <p className="font-medium">{artwork.artist?.username}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Current Bid</p>
                            <p className="font-medium">${artwork.currentBid.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Auction Ends</p>
                            <p className="font-medium">{new Date(artwork.auctionEndTime).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                </div>

                {/* Place Bid Form Section */}
                <PlaceBidForm artwork={artwork} />
            </div>
        </div>
    );
}
