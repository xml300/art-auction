"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ZoomIn, ZoomOut, X, Maximize2 } from "lucide-react";

interface ArtworkViewerProps {
  imageUrl: string;
  title: string;
  artistName?: string;
}

export function ArtworkViewer({ imageUrl, title, artistName }: ArtworkViewerProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
        setIsZoomed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  return (
    <>
      {/* Primary Display Frame */}
      <div className="relative group w-full rounded-2xl md:rounded-3xl overflow-hidden border border-border-subtle bg-surface-elevated/40 backdrop-blur-xs shadow-xs transition-all duration-300">
        {/* Canvas Area: flexible height ensuring full artwork display without harsh crops */}
        <div className="relative w-full h-[340px] sm:h-[440px] md:h-[520px] lg:h-[600px] flex items-center justify-center p-3 sm:p-6 bg-slate-950/5 dark:bg-slate-950/40">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 65vw, 800px"
            priority
            className="object-contain p-2 sm:p-4 transition-transform duration-500 group-hover:scale-[1.02]"
          />

          {/* Quick Lightbox Action Trigger */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            aria-label="Enlarge and inspect artwork"
            className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md border border-white/10 shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 active:scale-95"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inspect High-Res</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fade-in"
          onClick={() => {
            setIsLightboxOpen(false);
            setIsZoomed(false);
          }}
        >
          {/* Lightbox Top Control Bar */}
          <div
            className="flex items-center justify-between text-white shrink-0 z-20 pb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white line-clamp-1">
                {title}
              </h3>
              {artistName && (
                <p className="text-xs text-white/60">by {artistName}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-colors border border-white/10"
                title={isZoomed ? "Zoom Out" : "Zoom In"}
              >
                {isZoomed ? (
                  <>
                    <ZoomOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Reset Zoom</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4" />
                    <span className="hidden sm:inline">2x Zoom</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setIsZoomed(false);
                }}
                aria-label="Close fullscreen view"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Centered Image Container with Pan / Zoom */}
          <div
            className="flex-1 relative flex items-center justify-center overflow-auto my-auto cursor-zoom-in"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
          >
            <div
              className={`relative transition-transform duration-300 ease-out flex items-center justify-center ${
                isZoomed ? "scale-150 sm:scale-[1.8] cursor-zoom-out" : "scale-100"
              } w-full h-full max-h-[82vh]`}
            >
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="100vw"
                quality={95}
                className="object-contain"
              />
            </div>
          </div>

          {/* Lightbox Footer Tip */}
          <div
            className="text-center text-[11px] text-white/40 pt-2 shrink-0 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            Click image or use controls to toggle magnification. Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">Esc</kbd> to exit.
          </div>
        </div>
      )}
    </>
  );
}
