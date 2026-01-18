import { getArtworkById } from '@/data/queries';
import { PlaceBidForm } from './PlaceBidForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import Image from 'next/image';
import { cookies } from 'next/headers';
import EmptyState from '@/components/EmptyState';
import { JoinedReturnType } from '@/types';

export default async function PlaceBidPage({params}: {params: Promise<{id: string}>}) {
    const id = parseInt((await params).id); 
    const artwork = await getArtworkById(id, {withArtist: true}) as JoinedReturnType;
    const cookie = await cookies();
    const errors = cookie.get('errors')?.value;

    if(!artwork){
        return <EmptyState
        title='No such artwork exists'
        message='Please go back and try again.' />
    }

    


    return (
        <div className="container mx-auto p-6  dark:bg-dark-background dark:text-dark-text">
            <Link href="/dashboard/marketplace" className="font-bold">
            <ArrowLeft className="w-12 h-12 text-gray-600 backdrop-blur-lg bg-white dark:bg-black/60 shadow-lg dark:text-gray-300 hover:scale-110 transition-transform duration-200 mb-4 p-2 rounded-full" />
            </Link>
            <h1 className="text-4xl font-bold mb-8 mt-12">Place Your Bid</h1>

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
                            { artwork.currentBid && artwork.currentBid > 0 ? (
                                <p className="font-medium">${artwork.currentBid.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                            ):(
                                <p className="font-medium">${artwork.startingBid.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>

                            )}
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Auction Ends</p>
                            <p className="font-medium">{new Date(artwork.auctionEndTime).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                </div>

                {/* Place Bid Form Section */}
                <PlaceBidForm artwork={artwork} errors={errors || ""} />
            </div>
        </div>
    );
}
