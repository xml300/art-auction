import { getArtworkById } from "@/data/queries";
import { PlaceBidForm } from "./PlaceBidForm";
import { ArtworkViewer } from "./ArtworkViewer";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Layers,
  Maximize,
  User,
  ShieldCheck,
  Award,
  Sparkles,
} from "lucide-react";
import { cookies } from "next/headers";
import EmptyState from "@/components/EmptyState";
import { JoinedReturnType } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default async function PlaceBidPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id);
  const artwork = (await getArtworkById(id, {
    withArtist: true,
    withBids: true,
  })) as JoinedReturnType;
  const cookie = await cookies();
  const errors = cookie.get("errors")?.value;

  if (!artwork) {
    return (
      <EmptyState
        title="Artwork Not Found"
        message="The artwork lot you are looking for does not exist or may have been unlisted."
      />
    );
  }

  const currentPrice =
    artwork.currentBid && artwork.currentBid > 0
      ? artwork.currentBid
      : artwork.startingBid;

  return (
    <div className="w-full pb-20 lg:pb-12 space-y-6">
      {/* Breadcrumb Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/marketplace"
            aria-label="Back to Marketplace"
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-surface hover:bg-surface-elevated text-text border border-border-subtle shadow-xs transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>Marketplace</span>
              <span>/</span>
              <span>Lot #{artwork.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-text line-clamp-1">
              {artwork.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            Live Bidding Room
          </span>
        </div>
      </div>

      {/* Main Responsive Grid: Dominant Artwork Canvas (60-65%) vs Sticky Bidding Hub (35-40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        {/* Left Column: Dominant Artwork Showcase & Integrated Specs */}
        <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          {/* Expanded Artwork Matting Canvas with Zoom / Lightbox */}
          <ArtworkViewer
            imageUrl={artwork.imageUrl}
            title={artwork.title}
            artistName={artwork.artist?.username}
          />

          {/* Integrated Metadata & Storytelling Card */}
          <div className="rounded-2xl md:rounded-3xl border border-border-subtle bg-surface p-6 sm:p-8 shadow-xs space-y-6">
            {/* Title & Artist Identity */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
                  {artwork.title}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {artwork.artist?.username?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <span className="text-sm font-semibold text-text">
                    {artwork.artist?.username || "Verified Artist"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-text-muted bg-surface-elevated px-2 py-0.5 rounded-md border border-border-subtle">
                    <Award className="w-3 h-3 text-primary" /> Verified Artist
                  </span>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-xs uppercase font-semibold text-text-muted tracking-wider block">
                  Current Evaluation
                </span>
                <span className="text-2xl font-black text-text">
                  {formatCurrency(currentPrice)}
                </span>
              </div>
            </div>

            {/* Spec Matrix Badges (Medium, Dimensions, Year) */}
            <div>
              <h3 className="text-xs uppercase font-bold text-text-muted tracking-wider mb-3">
                Artwork Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-surface-elevated/50 border border-border-subtle">
                  <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    <span>Medium</span>
                  </div>
                  <p className="font-semibold text-sm text-text capitalize">
                    {artwork.medium || "Mixed Media"}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-elevated/50 border border-border-subtle">
                  <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
                    <Maximize className="w-3.5 h-3.5 text-primary" />
                    <span>Dimensions</span>
                  </div>
                  <p className="font-semibold text-sm text-text">
                    {artwork.dimensions || "Dimensions on request"}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-elevated/50 border border-border-subtle col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>Creation Year</span>
                  </div>
                  <p className="font-semibold text-sm text-text">
                    {artwork.year || new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </div>

            {/* Curated Description & Artist Notes */}
            {artwork.description && (
              <div>
                <h3 className="text-xs uppercase font-bold text-text-muted tracking-wider mb-2">
                  Curator&apos;s Notes & Description
                </h3>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed whitespace-pre-line">
                  {artwork.description}
                </p>
              </div>
            )}

            {/* Provenance & Authenticity Guarantee */}
            <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Certificate of Authenticity issued with digital ownership record.</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary shrink-0" />
                <span>Direct auction consignment</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Sticky Live Bidding Rail (35-40%) */}
        <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-4 z-20 w-full">
          <PlaceBidForm artwork={artwork} errors={errors || ""} />
        </aside>
      </div>

      {/* Mobile Sticky Quick-Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-surface/90 backdrop-blur-md border-t border-border-subtle lg:hidden flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
            Current High Bid
          </span>
          <span className="text-lg font-black text-text">
            {formatCurrency(currentPrice)}
          </span>
        </div>
        <a
          href="#bidAmount"
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md shadow-primary/20 active:scale-95"
        >
          Jump to Bid
        </a>
      </div>
    </div>
  );
}
