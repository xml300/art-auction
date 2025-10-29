import Link from "next/link";
import { Globe } from "lucide-react";
import EmptyState from "./EmptyState";
import { Activity } from "@/data/db";


interface ActivityFeedProps {
    activity: Activity[];
    emptyMessage: string;
}

export default function ActivityFeed({ activity, emptyMessage }: ActivityFeedProps) {
    return (
        <div className="space-y-4">
            {activity.length > 0 ? (
                activity.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center gap-4">
                        <Globe size={24} className="text-gray-500 dark:text-gray-400" />
                        <div>
                            {item.type === "bid" && item.amount !== undefined && (
                                <p className="text-lg">Placed a bid of <span className="font-semibold">${item.amount.toLocaleString()}</span> on <Link href={`/dashboard/marketplace/${item.artworkTitle}`} className="text-blue-600 hover:underline">{item.artworkTitle}</Link></p>
                            )}
                            {item.type === "won" && item.amount !== undefined && (
                                <p className="text-lg">Won the auction for <Link href={`/dashboard/my-artworks/${item.artworkTitle}`} className="text-green-600 hover:underline">{item.artworkTitle}</Link> for <span className="font-semibold">${item.amount.toLocaleString()}</span></p>
                            )}
                            {item.type === "watchlist_add" && (
                                <p className="text-lg">Added <Link href={`/dashboard/marketplace/${item.artworkTitle}`} className="text-purple-600 hover:underline">{item.artworkTitle}</Link> to watchlist</p>
                            )}
                            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleString()}</p>
                        </div>
                    </div>
                ))
            ) : (
                <EmptyState iconSrc="/globe.svg" title="No Activity" message={emptyMessage} />
            )}
        </div>
    );
}
