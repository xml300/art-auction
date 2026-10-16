"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  X,
} from "lucide-react";
import Link from "next/link";

export default function NewArtworkForm() {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [medium, setMedium] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [startingBid, setStartingBid] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [durationDays, setDurationDays] = useState(7);
  const [previewRatio, setPreviewRatio] = useState<"4/5" | "1/1" | "16/9">("4/5");

  // File upload state
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size cannot exceed 10MB.");
      return;
    }

    setError(null);
    const localUrl = URL.createObjectURL(file);
    setImagePreviewUrl(localUrl);

    // Upload immediately to storage service
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "artwork_image");
      formData.append("entityType", "artwork");

      const res = await fetch("/api/storage/files", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload artwork image");
      }

      setUploadedImageUrl(data.file.publicUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      setError(msg);
      setImagePreviewUrl("");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImagePreviewUrl("");
    setUploadedImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!uploadedImageUrl) {
      setError("Please upload an artwork image before listing.");
      return;
    }

    if (!title.trim()) {
      setError("Artwork title is required.");
      return;
    }

    const bidVal = parseFloat(startingBid);
    if (isNaN(bidVal) || bidVal <= 0) {
      setError("Please enter a valid starting bid amount.");
      return;
    }

    if (reservePrice) {
      const resVal = parseFloat(reservePrice);
      if (!isNaN(resVal) && resVal < bidVal) {
        setError("Reserve price cannot be lower than the starting bid.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        imageUrl: uploadedImageUrl,
        startingBid: bidVal,
        durationDays: Number(durationDays),
        medium: medium.trim() || "Mixed Media",
        dimensions: dimensions.trim() || "Unspecified",
        year: Number(year),
      };

      const res = await fetch("/api/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create artwork listing.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/artist-dashboard/artworks");
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Top back navigation */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <Link
          href="/artist-dashboard"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-catalog font-semibold text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Studio Overview</span>
        </Link>
        <span className="text-[11px] uppercase tracking-catalog text-text-muted">Consignment Suite</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Form Column */}
        <div className="flex-1 w-full bg-surface border border-border-subtle rounded-card p-6 sm:p-8 shadow-gallery">
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-catalog text-text-muted font-medium">New Consignment</span>
            <h2 className="text-xl sm:text-2xl font-serif italic text-text mt-0.5">Consign Artwork to Auction</h2>
            <p className="text-xs text-text-muted mt-1 font-light">
              Create an authenticated auction lot. Bidders will be able to place bids immediately upon publishing.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-card bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-card bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Artwork listed successfully! Redirecting to catalog...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload Zone */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium uppercase tracking-catalog text-text-muted">
                Artwork Photography / Visual Master *
              </label>

              {!imagePreviewUrl ? (
                <div
                  tabIndex={0}
                  role="button"
                  aria-label="Upload artwork photography"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border-subtle hover:border-accent/60 focus:border-accent focus:ring-1 focus:ring-accent bg-surface-elevated/40 hover:bg-surface-elevated rounded-card p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center group outline-none"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="p-3.5 rounded-card bg-surface border border-border-subtle text-accent group-hover:scale-105 transition-transform mb-3 shadow-gallery">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-text">
                    Click to select file or drag & drop high-resolution asset
                  </p>
                  <p className="text-xs text-text-muted mt-1 font-light">
                    Lossless PNG, JPG, or WEBP up to 10MB
                  </p>
                  <span className="mt-2 text-[10px] text-text-muted uppercase tracking-wider font-mono">
                    Press Enter or Space to Browse
                  </span>
                </div>
              ) : (
                <div className="relative rounded-card overflow-hidden border border-border-subtle bg-surface-elevated max-h-72 flex items-center justify-center group">
                  <Image
                    src={imagePreviewUrl}
                    alt="Artwork Preview"
                    width={600}
                    height={400}
                    className="w-full max-h-72 object-contain"
                  />
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white text-xs gap-2">
                      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      <span>Optimizing and uploading to archival storage...</span>
                    </div>
                  )}
                  {!isUploadingImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      aria-label="Remove image"
                      className="absolute top-3 right-3 p-1.5 rounded-gallery bg-black/70 hover:bg-rose-600 text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <Input
              label="Artwork Title *"
              placeholder="e.g. Celestial Symphony No. 4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Medium & Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Medium *"
                placeholder="e.g. Oil on Linen, Cast Bronze"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                required
              />
              <Input
                label="Dimensions *"
                placeholder="e.g. 91.4 x 121.9 cm (36 x 48 in)"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                required
              />
            </div>

            {/* Creation Year & Starting Bid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Year of Creation"
                type="number"
                min={1000}
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
              />
              <Input
                label="Starting Bid (₦) *"
                type="number"
                min={1}
                step={1}
                placeholder="e.g. 50000"
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                required
              />
              <Input
                label="Reserve Price (₦)"
                type="number"
                min={1}
                step={1}
                placeholder="Confidential floor"
                value={reservePrice}
                onChange={(e) => setReservePrice(e.target.value)}
                hint="Minimum confidential price required to trigger settlement"
              />
            </div>

            {/* Auction Duration */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium uppercase tracking-catalog text-text-muted">
                Auction Duration *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 7, 14, 30].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDurationDays(days)}
                    className={`py-2 px-3 rounded-card text-xs font-semibold border transition-all ${
                      durationDays === days
                        ? "bg-text text-background border-text shadow-gallery"
                        : "bg-surface-elevated text-text border-border-subtle hover:border-accent/40"
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-medium uppercase tracking-catalog text-text-muted">
                Artwork Dossier & Provenance
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide curatorial context, medium details, inspiration, and exhibition provenance..."
                className="w-full rounded-card border border-border-subtle bg-surface text-text text-sm py-2.5 px-3.5 transition-all duration-200 placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-light"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              isLoading={isSubmitting || isUploadingImage}
              disabled={isSubmitting || isUploadingImage || !uploadedImageUrl}
            >
              Publish Artwork & Open Auction
            </Button>
          </form>
        </div>

        {/* Right Preview Card */}
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          <div className="border border-border-subtle bg-surface rounded-card p-4 shadow-gallery space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-catalog text-text-muted">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Gallery Staging Preview</span>
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="flex items-center gap-1 text-[10px] font-mono">
              <span className="text-text-muted mr-1">Ratio:</span>
              {(["4/5", "1/1", "16/9"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setPreviewRatio(r)}
                  className={`px-2 py-0.5 rounded-gallery border transition-colors ${
                    previewRatio === r
                      ? "bg-text text-background border-text"
                      : "bg-surface-elevated text-text-muted border-border-subtle hover:text-text"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Museum Matting Preview Card */}
            <div className="rounded-card border border-border-subtle bg-surface overflow-hidden shadow-gallery p-3 flex flex-col justify-between">
              <div
                className={`relative w-full bg-surface-elevated/40 rounded-gallery flex items-center justify-center overflow-hidden transition-all duration-300 ${
                  previewRatio === "4/5" ? "aspect-[4/5]" : previewRatio === "1/1" ? "aspect-square" : "aspect-[16/9]"
                }`}
              >
                {imagePreviewUrl ? (
                  <Image
                    src={imagePreviewUrl}
                    alt="Preview"
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-text-muted gap-2 p-6">
                    <ImageIcon className="w-8 h-8 stroke-1 text-accent/60" />
                    <span className="text-[11px] font-light">Visual Asset Placeholder</span>
                  </div>
                )}
              </div>

              <div className="pt-3 pb-1 px-0.5 space-y-2">
                <div className="flex items-baseline justify-between text-[10px] uppercase tracking-catalog text-text-muted">
                  <span className="font-medium truncate max-w-[130px]">Artist Studio</span>
                  <span className="font-mono">Consigned Lot</span>
                </div>

                <h4 className="font-serif italic text-base text-text truncate">
                  {title || "Untitled Masterpiece"}
                </h4>

                <p className="text-[11px] text-text-muted line-clamp-2 font-light">
                  {description || "Curatorial narrative and medium specifications will appear here."}
                </p>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-catalog text-text-muted block">Starting Bid</span>
                    <span className="font-mono text-xs font-semibold tabular-nums text-text">
                      {startingBid ? formatCurrency(parseFloat(startingBid) || 0) : "₦0.00"}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-accent font-medium font-mono">
                    <Clock className="w-3 h-3" />
                    {durationDays}d auction
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-card border border-border-subtle bg-surface text-xs text-text-muted space-y-1.5 shadow-gallery">
            <p className="font-serif italic text-sm text-text">Consignment Terms</p>
            <p className="text-[11px] leading-relaxed font-light">
              Upon publication, the auction opens immediately for {durationDays} days. Bidders commit pre-authorized escrow balance. Upon settlement, 90% is atomically recorded to your studio earnings ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
