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
  const [durationDays, setDurationDays] = useState(7);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    setSelectedFile(file);
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
      setSelectedFile(null);
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
    setSelectedFile(null);
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
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Studio Overview
        </Link>
        <span className="text-xs text-text-muted">New Auction Lot</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Form Column */}
        <div className="flex-1 w-full bg-surface border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text">List New Artwork</h2>
            <p className="text-xs text-text-muted mt-1">
              Create an auction lot. Bidders will be able to place bids immediately upon publishing.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Artwork listed successfully! Redirecting to catalog...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload Zone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Artwork Photography / Visual Asset *
              </label>

              {!imagePreviewUrl ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border-subtle hover:border-primary/50 bg-surface-elevated/40 hover:bg-surface-elevated rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
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
                  <div className="p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-text">
                    Click to upload or drag & drop artwork image
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-border-subtle bg-surface-elevated max-h-72 flex items-center justify-center group">
                  <Image
                    src={imagePreviewUrl}
                    alt="Artwork Preview"
                    width={600}
                    height={400}
                    className="w-full max-h-72 object-contain"
                  />
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs gap-2">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Optimizing and uploading to storage...</span>
                    </div>
                  )}
                  {!isUploadingImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      aria-label="Remove image"
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white transition-colors"
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
                placeholder="e.g. Oil on Canvas, Bronze"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                required
              />
              <Input
                label="Dimensions *"
                placeholder="e.g. 36 x 48 inches"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                required
              />
            </div>

            {/* Creation Year & Starting Bid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Year of Creation"
                type="number"
                min={1000}
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
              />
              <Input
                label="Starting Bid (USD/NGN) *"
                type="number"
                min={1}
                step={1}
                placeholder="e.g. 500"
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                required
              />
            </div>

            {/* Auction Duration */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Auction Duration *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 7, 14, 30].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDurationDays(days)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      durationDays === days
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-surface-elevated text-text border-border-subtle hover:border-primary/40"
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Artwork Description & Provenance
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide context, inspiration, artistic narrative, and provenance for collectors..."
                className="w-full rounded-xl border border-border-subtle bg-surface text-text text-sm py-2.5 px-3.5 transition-all duration-200 placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
          <div className="border border-border-subtle bg-surface rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Live Marketplace Preview</span>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface-elevated overflow-hidden shadow-xs">
              <div className="relative w-full h-52 bg-slate-900/10 flex items-center justify-center overflow-hidden">
                {imagePreviewUrl ? (
                  <Image
                    src={imagePreviewUrl}
                    alt="Preview"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-text-muted gap-2">
                    <ImageIcon className="w-10 h-10 stroke-1" />
                    <span className="text-xs">Image preview</span>
                  </div>
                )}
                <div className="absolute top-2.5 right-2.5 bg-primary/90 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  {startingBid ? formatCurrency(parseFloat(startingBid) || 0) : "$0.00"}
                </div>
              </div>

              <div className="p-3.5 space-y-2">
                <h4 className="font-bold text-sm text-text truncate">
                  {title || "Untitled Artwork"}
                </h4>
                <p className="text-[11px] text-text-muted line-clamp-2">
                  {description || "No description provided yet."}
                </p>
                <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
                  <span>{medium || "Medium"}</span>
                  <span className="flex items-center gap-1 font-medium text-amber-500">
                    <Clock className="w-3 h-3" />
                    {durationDays}d auction
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-2xl border border-border-subtle bg-surface text-xs text-text-muted space-y-1.5">
            <p className="font-semibold text-text">Auction Settlement Rules</p>
            <p className="text-[11px] leading-relaxed">
              Once listed, the auction will run for {durationDays} days. Bidders must hold sufficient wallet funds. When settled, 90% is credited directly to your studio earnings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
