"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Artwork } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { AlertCircle, CheckCircle, Gavel } from "lucide-react";

export function PlaceBidForm({ artwork, errors }: { artwork: Artwork; errors: string }) {
  const minBid = (artwork.currentBid && artwork.currentBid > 0 ? artwork.currentBid : artwork.startingBid) + 1;
  const [currentBid, setCurrentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState<number>(minBid);
  const [error, setError] = useState<string | null>(errors);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    api.get<{ wallet: number }>("/profile")
      .then((json) => {
        setWalletBalance(json.wallet);
      })
      .catch((err) => console.error("Wallet error:", err));
  }, []);

  const parseNumber = (str: string) => {
    const cleaned = str.replace(/[^0-9.]/g, "");
    return Number(cleaned);
  };

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const newRawValue = parseNumber(inputValue);
    setBidAmount(newRawValue);
  };

  const handlePredefinedBid = (amount: number) => {
    setBidAmount((prevAmount) => prevAmount + amount);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setError(null);
    setSuccessMessage(null);

    if (bidAmount < minBid) {
      setError(`Bid amount must be at least ${formatCurrency(minBid)}.`);
      event.preventDefault();
      return;
    }

    if (bidAmount > walletBalance) {
      setError("Insufficient bidding funds. Please deposit to your wallet first.");
      event.preventDefault();
      router.push("/dashboard/deposit");
      return;
    }

    setIsSubmitting(true);
  };

  const getPredefinedBidOptions = (basePrice: number) => {
    return [0.05 * basePrice, 0.1 * basePrice, 0.25 * basePrice, 0.5 * basePrice].map((num) =>
      num > 10 ? Math.round(0.1 * num) * 10 : Math.round(num * 100) * 0.01
    );
  };

  const predefinedOptions = useMemo(
    () =>
      getPredefinedBidOptions(
        artwork.currentBid && artwork.currentBid > 0 ? artwork.currentBid : artwork.startingBid
      ),
    [artwork.currentBid, artwork.startingBid]
  );

  const formattedBidAmount = useMemo(() => {
    return formatCurrency(bidAmount);
  }, [bidAmount]);

  useEffect(() => {
    api.get<{ bidAmount: number }>(`/bid?artworkId=${artwork.id}`)
      .then((json) => {
        setCurrentBid(json.bidAmount);
      })
      .catch((err) => console.error("Bid error:", err));
  }, [artwork.id]);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-xs flex flex-col justify-between max-w-xl mx-auto space-y-5 animate-fade-in text-left">
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-primary">
            Active Auction Lot
          </span>
          <h2 className="text-xl font-bold tracking-tight text-text">Place Your Bid</h2>
        </div>

        {currentBid > 0 && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            High Bid: {formatCurrency(currentBid)}
          </span>
        )}
      </div>

      <form
        method="POST"
        action={`/api/artworks/${artwork.id}/bid`}
        className="space-y-5"
        onSubmit={handleSubmit}
      >
        {error && (
          <div
            className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-fade-in"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
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
          <label
            htmlFor="bidAmount"
            className="block text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            Bid Increment (Minimum {formatCurrency(minBid)})
          </label>
          <input
            type="text"
            id="bidAmount"
            name="bidAmount"
            ref={inputRef}
            value={formattedBidAmount}
            onChange={handleBidChange}
            className="w-full py-3 px-4 rounded-xl border border-border-subtle bg-surface text-center text-2xl font-extrabold text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            required
          />
        </div>

        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
            Quick Increment Chips
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {predefinedOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handlePredefinedBid(option)}
                className="py-2 px-3 rounded-xl border border-border-subtle bg-surface-elevated text-xs font-semibold text-text hover:border-primary/40 hover:bg-surface transition-colors"
              >
                +₦{option.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
            leftIcon={<Gavel className="w-4 h-4" />}
          >
            {isSubmitting ? "Submitting Bid..." : "Confirm & Place Bid"}
          </Button>
          <p className="text-[11px] text-text-muted mt-2 text-center">
            Your bid is legally binding. You will be alerted immediately if outbid.
          </p>
        </div>
      </form>
    </div>
  );
}
