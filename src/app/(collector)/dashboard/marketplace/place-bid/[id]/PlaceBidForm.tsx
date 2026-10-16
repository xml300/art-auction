"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { JoinedReturnType, Bid } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import DepositModal from "@/components/DepositModal";
import { CountdownTimer } from "./CountdownTimer";
import {
  AlertCircle,
  CheckCircle,
  Gavel,
  Wallet,
  PlusCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  X,
  History,
} from "lucide-react";

interface PlaceBidFormProps {
  artwork: JoinedReturnType;
  errors: string;
}

export function PlaceBidForm({ artwork, errors }: PlaceBidFormProps) {
  const currentHighest =
    artwork.currentBid && artwork.currentBid > 0
      ? artwork.currentBid
      : artwork.startingBid;
  const minBid =
    (artwork.currentBid && artwork.currentBid > 0
      ? artwork.currentBid
      : artwork.startingBid) + 1;

  const [currentBid, setCurrentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState<number>(minBid);
  const [rawBidInput, setRawBidInput] = useState<string>(String(minBid));
  const [isAuctionEnded, setIsAuctionEnded] = useState<boolean>(
    () => new Date(artwork.auctionEndTime).getTime() <= Date.now()
  );
  const [error, setError] = useState<string | null>(errors || null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [recentBids, setRecentBids] = useState<Bid[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Read success cookie if redirected from successful bid
  useEffect(() => {
    const match = document.cookie.match(/success=([^;]+)/);
    if (match) {
      setSuccessMessage(decodeURIComponent(match[1]));
      document.cookie = "success=; max-age=0; path=/";
    }
  }, []);

  // Load user wallet
  useEffect(() => {
    api
      .get<{ wallet: number }>("/profile")
      .then((json) => {
        setWalletBalance(json.wallet);
      })
      .catch((err) => console.error("Wallet error:", err));
  }, []);

  // Fetch current user's highest bid on this artwork
  useEffect(() => {
    api
      .get<{ bidAmount: number }>(`/bid?artworkId=${artwork.id}`)
      .then((json) => {
        setCurrentBid(json.bidAmount);
      })
      .catch(() => {
        // user hasn't bid yet, ignore 404
      });
  }, [artwork.id]);

  // Fetch anonymous recent bid history
  useEffect(() => {
    setIsLoadingHistory(true);
    fetch(`/api/artworks/${artwork.id}?bids=true`)
      .then((res) => res.json())
      .then((data) => {
        if (data.artwork?.bids && Array.isArray(data.artwork.bids)) {
          // Sort bids desc
          const sorted = [...data.artwork.bids].sort(
            (a, b) => new Date(b.bidTime).getTime() - new Date(a.bidTime).getTime()
          );
          setRecentBids(sorted);
        }
      })
      .catch((err) => console.error("Recent bids error:", err))
      .finally(() => setIsLoadingHistory(false));
  }, [artwork.id]);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    setRawBidInput(val);
    const parsed = parseFloat(val);
    setBidAmount(isNaN(parsed) ? 0 : parsed);
  };

  const handlePredefinedBid = (amount: number) => {
    const nextAmount = (bidAmount || minBid) + amount;
    setBidAmount(nextAmount);
    setRawBidInput(String(nextAmount));
  };

  const handleResetToMin = () => {
    setBidAmount(minBid);
    setRawBidInput(String(minBid));
  };

  const validateBid = (): boolean => {
    setError(null);
    setSuccessMessage(null);

    if (bidAmount < minBid) {
      setError(`Bid amount must be at least ${formatCurrency(minBid)}.`);
      return false;
    }

    if (bidAmount > walletBalance) {
      setError("Insufficient bidding funds in your wallet. Please deposit first.");
      return false;
    }

    return true;
  };

  // Called when clicking "Review Bid"
  const handleOpenConfirmModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateBid()) {
      setIsConfirmModalOpen(true);
    }
  };

  // Executed once user confirms inside secondary modal
  const handleConfirmSubmit = () => {
    setIsSubmitting(true);
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const getPredefinedBidOptions = (basePrice: number) => {
    return [0.05 * basePrice, 0.1 * basePrice, 0.25 * basePrice, 0.5 * basePrice].map(
      (num) => (num > 10 ? Math.round(0.1 * num) * 10 : Math.round(num * 100) * 0.01)
    );
  };

  const predefinedOptions = useMemo(
    () =>
      getPredefinedBidOptions(
        artwork.currentBid && artwork.currentBid > 0
          ? artwork.currentBid
          : artwork.startingBid
      ),
    [artwork.currentBid, artwork.startingBid]
  );

  const formattedBidAmount = useMemo(() => {
    return formatCurrency(bidAmount);
  }, [bidAmount]);

  const hasSufficientFunds = walletBalance >= minBid;

  return (
    <>
      <div className="w-full rounded-card border border-border-subtle bg-surface p-5 sm:p-7 shadow-gallery flex flex-col gap-6 text-left">
        {/* Top Lot Summary & Live Ticker */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                Live Auction Lot #{artwork.id}
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-text mt-1">
              Bidding Room
            </h2>
          </div>

          <CountdownTimer endTime={artwork.auctionEndTime} onExpire={() => setIsAuctionEnded(true)} />
        </div>

        {/* Current Bid & Pricing Banner */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-surface-elevated/60 border border-border-subtle">
          <div>
            <span className="text-[11px] uppercase font-semibold text-text-muted tracking-wider block">
              {artwork.currentBid && artwork.currentBid > 0 ? "Highest Bid" : "Starting Price"}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mt-0.5">
              {formatCurrency(currentHighest)}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase font-semibold text-text-muted tracking-wider block">
              Minimum Next Bid
            </span>
            <div className="text-lg sm:text-xl font-bold text-primary mt-1">
              {formatCurrency(minBid)}
            </div>
            {currentBid > 0 && (
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                Your highest: {formatCurrency(currentBid)}
              </span>
            )}
          </div>
        </div>

        {/* Wallet Balance Strip with 1-Click Deposit Modal */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border-subtle shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase font-semibold text-text-muted">
                Available Bidding Balance
              </p>
              <p className="text-sm font-bold text-text">
                {formatCurrency(walletBalance)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDepositOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-elevated hover:bg-border-subtle text-text transition-colors border border-border-subtle shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5 text-primary" />
            <span>Deposit</span>
          </button>
        </div>

        {/* Bid Placement Form */}
        <form
          ref={formRef}
          method="POST"
          action={`/api/artworks/${artwork.id}/bid`}
          className="space-y-5"
          onSubmit={handleOpenConfirmModal}
        >
          {error && (
            <div
              className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-fade-in"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <div className="flex-1">{error}</div>
              {!hasSufficientFunds && (
                <button
                  type="button"
                  onClick={() => setIsDepositOpen(true)}
                  className="font-bold underline text-xs ml-2 hover:opacity-80"
                >
                  Deposit Now
                </button>
              )}
            </div>
          )}

          {successMessage && (
            <div
              className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2"
              role="alert"
            >
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="bidAmount"
                className="block text-xs font-semibold uppercase tracking-wider text-text-muted"
              >
                Your Offer Amount
              </label>
              <span className="text-[11px] text-text-muted">
                Min: {formatCurrency(minBid)}
              </span>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4 text-text-muted font-mono font-bold text-lg pointer-events-none select-none">
                ₦
              </span>
              <input
                type="text"
                id="bidAmount"
                name="bidAmount"
                ref={inputRef}
                value={rawBidInput}
                onChange={handleBidChange}
                disabled={isAuctionEnded}
                placeholder={String(minBid)}
                className="w-full py-3.5 pl-10 pr-4 rounded-card border border-border-subtle bg-surface text-center font-mono tabular-nums text-2xl sm:text-3xl font-extrabold text-text focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent transition-all disabled:opacity-50"
                required
              />
            </div>
          </div>

          {/* Quick Increment Chips */}
          {!isAuctionEnded && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-catalog text-text-muted">
                  Quick Increment Chips
                </span>
                <button
                  type="button"
                  onClick={handleResetToMin}
                  className="text-[11px] text-text-muted hover:text-accent font-semibold tracking-wider transition-colors"
                >
                  Reset to Min (₦{minBid.toLocaleString()})
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {predefinedOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handlePredefinedBid(option)}
                    className="py-2.5 px-3 rounded-card border border-border-subtle bg-surface-elevated text-xs font-mono font-semibold text-text hover:border-accent/40 hover:bg-surface transition-colors active:scale-95 min-h-[44px]"
                  >
                    +₦{option.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-4 text-base font-bold shadow-md shadow-primary/20"
              isLoading={isSubmitting}
              disabled={isAuctionEnded}
              leftIcon={<Gavel className="w-4 h-4" />}
            >
              {isAuctionEnded
                ? "Auction Concluded"
                : isSubmitting
                ? "Submitting Bid..."
                : `Review & Place Bid of ${formattedBidAmount}`}
            </Button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted mt-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Authenticity guaranteed. Outbid alerts sent instantly.</span>
            </div>
          </div>
        </form>

        {/* Anonymous Recent Bid History Accordion */}
        <div className="border-t border-border-subtle pt-4">
          <button
            type="button"
            onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-text-muted hover:text-text transition-colors py-1"
          >
            <div className="flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-primary" />
              <span>Recent Bids ({recentBids.length})</span>
            </div>
            {isHistoryExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {isHistoryExpanded && (
            <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1 animate-fade-in text-xs">
              {isLoadingHistory ? (
                <p className="text-text-muted text-center py-2">Loading lot activity...</p>
              ) : recentBids.length === 0 ? (
                <p className="text-text-muted text-center py-2">No bids recorded yet. Be the first!</p>
              ) : (
                recentBids.map((b, idx) => (
                  <div
                    key={b.id || idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-surface-elevated/40 border border-border-subtle"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      <span className="font-medium text-text-muted">
                        Bidder #{b.id ? String(b.id * 17).slice(-4) : idx + 1}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-text">
                        {formatCurrency(b.bidAmount)}
                      </span>
                      <span className="text-[10px] text-text-muted block">
                        {new Date(b.bidTime || Date.now()).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Confirmation Modal */}
      {isConfirmModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-bid-title"
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => !isSubmitting && setIsConfirmModalOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && !isSubmitting) setIsConfirmModalOpen(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface rounded-card shadow-gallery-elevated border border-border-subtle p-6 max-w-md w-full animate-scale-in text-left space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-card bg-accent/10 text-accent flex items-center justify-center">
                  <Gavel className="w-4 h-4" />
                </div>
                <h3 id="confirm-bid-title" className="font-serif text-lg font-bold text-text">
                  Confirm Binding Bid
                </h3>
              </div>
              <button
                type="button"
                onClick={() => !isSubmitting && setIsConfirmModalOpen(false)}
                aria-label="Close dialog"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-card text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3.5 rounded-card bg-surface-elevated border border-border-subtle space-y-2">
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Artwork Lot</span>
                  <span className="font-semibold text-text">{artwork.title}</span>
                </div>
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Hammer Offer</span>
                  <span className="font-mono tabular-nums font-semibold text-text">{formattedBidAmount}</span>
                </div>
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Buyer&apos;s Premium</span>
                  <span className="font-semibold text-success">0% (₦0.00)</span>
                </div>
                <div className="pt-2 border-t border-border-subtle flex justify-between items-center">
                  <span className="text-xs uppercase font-bold text-text">Total Escrow Hold</span>
                  <span className="font-mono tabular-nums text-xl font-black text-primary">
                    {formattedBidAmount}
                  </span>
                </div>
              </div>

              {/* Escrow Balance Transparency */}
              <div className="p-3 rounded-card bg-surface border border-border-subtle text-xs space-y-1">
                <div className="flex justify-between text-text-muted">
                  <span>Current Available Balance:</span>
                  <span className="font-mono font-medium">{formatCurrency(walletBalance)}</span>
                </div>
                <div className="flex justify-between font-semibold text-text">
                  <span>Remaining After Bid:</span>
                  <span className="font-mono">{formatCurrency(walletBalance - bidAmount)}</span>
                </div>
              </div>

              <div className="p-3 rounded-card bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                Bids are legally binding. Funds are locked in escrow and returned immediately if you are outbid.
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={isSubmitting}
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                className="flex-1"
                isLoading={isSubmitting}
                onClick={handleConfirmSubmit}
              >
                Place Bid Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Integrated Deposit Modal */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        returnUrl={`/dashboard/marketplace/place-bid/${artwork.id}`}
      />
    </>
  );
}
