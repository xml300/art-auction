"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Artwork, User } from '@/types';
import { FaRegUserCircle } from 'react-icons/fa';
import ArtworkCard from '@/components/ArtworkCard';


export default function ClientArtworkDetailsPage({ artwork }: {
    artwork: Artwork & {
        artist: User;
        relatedWorks: Artwork[];
    }
}) {
    const [artist] = useState<User>(artwork.artist);
    const [relatedArtworks] = useState<Artwork[]>(artwork.relatedWorks);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg shadow-lg overflow-hidden backdrop-filter backdrop-blur-xl border border-gray-200/10">
                            <div className="relative w-full h-96">
                                <Image
                                    src={artwork.imageUrl}
                                    alt={artwork.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{artwork.title}</h1>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                                    <FaRegUserCircle className="mr-2" />
                                    <span>{artist ? artist.username : 'Loading artist...'}</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{artwork.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg shadow-lg p-6 backdrop-filter backdrop-blur-xl border border-gray-200/50">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Artwork Details</h3>
                            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                <li><strong>Medium:</strong> {artwork.medium}</li>
                                <li><strong>Dimensions:</strong> {artwork.dimensions}</li>
                                <li><strong>Year:</strong> {artwork.year}</li>
                            </ul>
                        </div> */}

                        <div className="bg-white/30 dark:bg-gray-800/30 rounded-lg shadow-lg p-6 backdrop-filter backdrop-blur-xl border border-gray-200/10">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                                    View Certificate
                                </button>
                                {artwork.ownerId != null && (
                                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                                        List for Resale
                                    </button>
                                )}
                                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                                    Transfer Ownership
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Artworks</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedArtworks.length > 0 ? (
                            relatedArtworks.map((relatedArtwork, index) => (
                                <ArtworkCard key={relatedArtwork.id} artwork={relatedArtwork} index={index} owned={relatedArtwork.ownerId === artwork?.ownerId} />
                            ))
                        ) : (
                            <p>No related artworks found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
