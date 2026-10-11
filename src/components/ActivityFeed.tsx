import Link from "next/link";
import { Gavel, Trophy, Bookmark, Activity as ActivityIcon } from "lucide-react";
import EmptyState from "./EmptyState";
import { Activity } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ActivityFeedProps {
  activity: Activity[];
  emptyMessage: string;
}

export default function ActivityFeed({ activity, emptyMessage }: ActivityFeedProps) {
  const renderIcon = (type: string) => {
    switch (type) {
      case "bid":
        return <Gavel className="w-5 h-5 text-primary" />;
      case "won":
      case "auction_won":
        return <Trophy className="w-5 h-5 text-emerald-500" />;
      case "watchlist_add":
        return <Bookmark className="w-5 h-5 text-purple-500" />;
      default:
        return <ActivityIcon className="w-5 h-5 text-text-muted" />;
    }
  };

  const renderContent = (item: Activity) => {
    const artworkLink = item.artworkId ? (
      <Link
        href={
          item.type === "won" || item.type === "auction_won"
            ? `/dashboard/my-artworks/${item.artworkId}`
            : `/dashboard/marketplace/place-bid/${item.artworkId}`
        }
        className="text-primary hover:underline font-medium"
      >
        {item.artworkTitle || `Artwork #${item.artworkId}`}
      </Link>
    ) : (
      <span className="font-medium text-text">{item.artworkTitle || "Artwork"}</span>
    );

    if (item.type === "bid") {
      return (
        <p className="text-sm sm:text-base text-text">
          Placed a bid of{" "}
          <span className="font-semibold text-text">
            {item.amount != null ? formatCurrency(item.amount) : "₦0"}
          </span>{" "}
          on {artworkLink}
        </p>
      );
    }

    if (item.type === "won" || item.type === "auction_won") {
      return (
        <p className="text-sm sm:text-base text-text">
          Won the auction for {artworkLink}{" "}
          {item.amount != null && (
            <>
              for <span className="font-semibold text-text">{formatCurrency(item.amount)}</span>
            </>
          )}
        </p>
      );
    }

    if (item.type === "watchlist_add") {
      return (
        <p className="text-sm sm:text-base text-text">
          Added {artworkLink} to watchlist
        </p>
      );
    }

    return (
      <p className="text-sm sm:text-base text-text">
        {item.type.replace(/_/g, " ")} {item.artworkTitle ? `on ${artworkLink}` : ""}
      </p>
    );
  };

  return (
    <div className="space-y-3">
      {activity.length > 0 ? (
        activity.map((item) => (
          <div
            key={item.id}
            className="bg-surface rounded-xl border border-border-subtle p-4 flex items-center gap-4 transition-all hover:border-border"
          >
            <div className="p-2.5 rounded-xl bg-surface-elevated shrink-0">
              {renderIcon(item.type)}
            </div>
            <div className="min-w-0 flex-1">
              {renderContent(item)}
              <p className="text-xs text-text-muted mt-0.5">
                {new Date(item.createdAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))
      ) : (
        <EmptyState iconSrc="/globe.svg" title="No Activity" message={emptyMessage} />
      )}
    </div>
  );
}
