"use client";

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface Artwork {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    startingBid: number;
    currentBid: number;
    auctionEndTime: string;
    artistId: number;
    ownerId: number | null;
    createdAt: string;
    updatedAt: string;
    status: string;
}

export default function ArtworkDetailPage() {
    const params = useParams();
    const { id } = params;
    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    
    const allArtworks: Artwork[] = useMemo(() => ([
        {
            "id": "1",
            "title": "Sunset Over the Aegean",
            "description": "A vibrant oil painting capturing the mesmerizing colors of a sunset reflecting on the sea. Painted in 2023.",
            "imageUrl": "https://example.com/images/sunset_aegean.jpg",
            "startingBid": 1500,
            "currentBid": 1750,
            "auctionEndTime": "2025-11-15T18:00:00Z",
            "artistId": 101,
            "ownerId": 102,
            "createdAt": "2025-10-20T10:30:00Z",
            "updatedAt": "2025-10-22T14:45:10Z",
            "status": "Owned"
        },
        {
            "id": "2",
            "title": "Urban Dreams",
            "description": "Abstract acrylic on canvas, exploring the chaotic beauty of city life and its hidden narratives.",
            "imageUrl": "https://example.com/images/urban_dreams.jpg",
            "startingBid": 800,
            "currentBid": 800,
            "auctionEndTime": "2025-11-10T20:00:00Z",
            "artistId": 103,
            "ownerId": null,
            "createdAt": "2025-10-18T09:15:00Z",
            "updatedAt": "2025-10-18T09:15:00Z",
            "status": "On Auction"
        },
        {
            "id": "3",
            "title": "The Silent Watcher",
            "description": "A striking bronze sculpture of an owl perched on a branch, symbolizing wisdom and mystery.",
            "imageUrl": "https://example.com/images/silent_watcher_sculpture.jpg",
            "startingBid": 3000,
            "currentBid": 3500,
            "auctionEndTime": "2025-11-12T17:30:00Z",
            "artistId": 104,
            "ownerId": 104,
            "createdAt": "2025-10-15T16:00:00Z",
            "updatedAt": "2025-10-21T11:20:30Z",
            "status": "Owned"
        },
        {
            "id": "4",
            "title": "Ephemeral Bloom",
            "description": "Delicate watercolor painting of a cherry blossom branch, capturing a fleeting moment of spring.",
            "imageUrl": "https://example.com/images/ephemeral_bloom.jpg",
            "startingBid": 500,
            "currentBid": 650,
            "auctionEndTime": "2025-11-18T19:00:00Z",
            "artistId": 101,
            "ownerId": null,
            "createdAt": "2025-10-21T11:05:00Z",
            "updatedAt": "2025-10-23T09:00:00Z",
            "status": "On Auction"
        }
    ]), []);

    useEffect(() => {
        if (id) {
            const foundArtwork = allArtworks.find(artwork => artwork.id === id);
            if (foundArtwork) {
                setArtwork(foundArtwork);
            } else {
                setError("Artwork not found.");
            }
            setLoading(false);
        }
    }, [id, allArtworks]);

    if (loading) {
        return <div className="text-center text-xl mt-12">Loading artwork details...</div>;
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
                        className="w-full h-auto object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                </div>

                <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg animate-fade-in-delay-2">{artwork.description}</p>

                    <div className="space-y-4 animate-fade-in-delay-3">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Status:</p>
                            <p className="text-lg sm:text-xl font-semibold">{artwork.status}</p>
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
                        {artwork.status === "Owned" && (
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
