"use client";

import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Artwork } from '@/data/db';

export default function ArtworkDetailPage() {
    const params = useParams();
    const { id } = params;
    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    
 
    useEffect(() => {
        fetch(`/api/artworks/${id}`)
        .then(res => res.json())
        .then(json => {
            setArtwork(json.artwork);
            setLoading(false);
        })
        setError("");
    }, [id]);


    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    if (!artwork) {
        return <div className="text-center text-xl mt-12">No artwork selected.</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 animate-fade-in">{artwork.title}</h1>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 animate-fade-in-delay-1">
                <div className="w-full lg:w-1/2">
                    <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        width={800}
                        height={800}
                        className="w-full h-auto object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                </div>

                <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg animate-fade-in-delay-2">{artwork.description}</p>

                    <div className="space-y-4 animate-fade-in-delay-3">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Status:</p>
                            <p className="text-lg sm:text-xl font-semibold">{artwork.ownerId != null ? "Owned" : "On Auction"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Current Bid:</p>
                            <p className="text-lg sm:text-xl font-semibold">${artwork.currentBid.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Auction Ends:</p>
                            <p className="text-base sm:text-lg lg:text-xl font-semibold">
                                {new Date(artwork.auctionEndTime).toLocaleDateString("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-delay-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors hover:scale-105  duration-200 flex-1 sm:flex-none">
                            View Certificate
                        </button>
                        {artwork.ownerId != null && (
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors hover:scale-105 duration-200 flex-1 sm:flex-none">
                                List for Resale
                            </button>
                        )}
                        <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors hover:scale-105 duration-200 flex-1 sm:flex-none">
                            Transfer Ownership
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
