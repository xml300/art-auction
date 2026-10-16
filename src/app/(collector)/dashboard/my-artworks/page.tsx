import PaginatedArtworks from "@/components/PaginatedArtworks";
import { getArtworks } from "@/data/queries";
import EmptyState from "@/components/EmptyState";
import { getSession } from "@/lib/auth";
import { Vault } from "lucide-react";

export default async function MyArtworksPage() {
  const [session] = await getSession();
  const artworks = await getArtworks(session!.userId);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="border-b border-border-subtle pb-4">
        <span className="text-[11px] uppercase tracking-catalog font-medium text-text-muted">
          Authenticated Holdings
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif italic text-text mt-0.5">
          Collector Vault
        </h1>
        <p className="text-xs text-text-muted mt-1 font-light">
          Manage your personal acquisitions and authenticated artwork holdings.
        </p>
      </div>

      {artworks.length === 0 ? (
        <EmptyState
          title="No Acquired Works"
          message="You have not acquired any artworks yet. Active lots in the marketplace are open for bidding."
          icon={<Vault className="w-8 h-8" />}
        />
      ) : (
        <PaginatedArtworks artworks={artworks} />
      )}
    </div>
  );
}
