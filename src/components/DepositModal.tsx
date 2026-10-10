"use client";

import { useState, useEffect } from "react";
import { X, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const handleDeposit = () => {
    setIsProcessing(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => !isProcessing && onClose()}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-center items-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl shadow-2xl border border-border-subtle p-6 max-w-md w-full animate-scale-in text-left space-y-5"
      >
        <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-text">Deposit Funds</h2>
            <p className="text-xs text-text-muted">Instant credit to your bidding balance</p>
          </div>
          <button
            onClick={() => !isProcessing && onClose()}
            aria-label="Close modal"
            className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form method="POST" action="/api/deposit" onSubmit={handleDeposit} className="space-y-4">
          <Input
            label="Amount (₦)"
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 50000"
            min="100"
            step="1"
            required
            leftIcon={<DollarSign className="w-4 h-4" />}
            hint="Minimum deposit amount is ₦100.00"
          />

          <div className="flex gap-2">
            {[10000, 50000, 100000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border border-border-subtle bg-surface-elevated text-text hover:border-primary/40 transition-colors"
              >
                +₦{preset.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={isProcessing}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isProcessing}
              disabled={!amount || Number(amount) < 100 || isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Deposit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
