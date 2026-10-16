"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  AlertOctagon,
  Loader2,
} from "lucide-react";

interface LedgerAccount {
  id: number;
  accountNumber: string;
  name: string;
  type: "asset" | "liability" | "equity" | "revenue" | "expense";
  currency: string;
  balanceKobo: number;
  balanceNaira: number;
}

interface JournalEntry {
  id: number;
  idempotencyKey: string;
  entryType: string;
  reference: string;
  description: string;
  createdAt: string;
  postings: Array<{
    id: number;
    accountId: number;
    amount: number;
    direction: "debit" | "credit";
    accountName: string;
    accountNumber: string;
  }>;
}

export default function AdminFinancePage() {
  const [accounts, setAccounts] = useState<LedgerAccount[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFinance() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/finance");
        const data = await res.json();
        if (res.ok && data.success) {
          setAccounts(data.accounts || []);
          setJournalEntries(data.journalEntries || []);
        }
      } catch (err) {
        console.error("Failed to load finance data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFinance();
  }, []);

  const totalDebits = journalEntries.reduce(
    (acc, entry) =>
      acc +
      entry.postings
        .filter((p) => p.direction === "debit")
        .reduce((sum, p) => sum + p.amount, 0),
    0
  );

  const totalCredits = journalEntries.reduce(
    (acc, entry) =>
      acc +
      entry.postings
        .filter((p) => p.direction === "credit")
        .reduce((sum, p) => sum + p.amount, 0),
    0
  );

  const isBalanced = totalDebits === totalCredits;

  const assetAccounts = accounts.filter((a) => a.type === "asset");
  const liabilityAccounts = accounts.filter((a) => a.type === "liability");
  const revenueAccounts = accounts.filter((a) => a.type === "revenue");

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <span className="text-[11px] uppercase tracking-catalog font-medium text-text-muted">
            Financial Ledger System
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-text mt-0.5">
            Double-Entry Accounting Oversight
          </h2>
          <p className="text-xs text-text-muted mt-1 font-light">
            Immutable journal entries, trial balance validation, and custodial escrow reconciliation.
          </p>
        </div>
      </div>

      {/* Trial Balance Invariant Verification Card */}
      <div
        className={`p-5 rounded-card border shadow-gallery flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isBalanced
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-950 dark:text-emerald-100"
            : "bg-rose-500/5 border-rose-500/20 text-rose-950 dark:text-rose-100"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`p-2.5 rounded-gallery border ${
              isBalanced
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
            }`}
          >
            {isBalanced ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertOctagon className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              <span className="font-serif italic text-base">Trial Balance Invariant:</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-gallery font-mono font-bold uppercase tracking-wider border ${
                  isBalanced
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                }`}
              >
                {isBalanced ? "Debits = Credits (Strict Invariant Preserved)" : "Out of Balance"}
              </span>
            </div>
            <p className="text-xs opacity-80 mt-1 font-mono tabular-nums">
              Recorded Postings: Total Debits = {formatCurrency(totalDebits / 100)} | Total Credits = {formatCurrency(totalCredits / 100)}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-3 text-text-muted">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
          <span className="text-xs font-light">Loading ledger balance sheets...</span>
        </div>
      ) : (
        <>
          {/* Chart of Accounts Balance Summary */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-border-subtle">
              <span className="text-[11px] uppercase tracking-catalog font-medium text-text-muted">
                General Ledger
              </span>
              <span className="text-xs font-mono text-text-muted">{accounts.length} active accounts</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Asset Accounts */}
              <div className="p-4 rounded-card border border-border-subtle bg-surface shadow-gallery space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <span className="text-xs font-semibold uppercase tracking-catalog text-text">
                    Assets (Custody & Gateway)
                  </span>
                  <span className="text-[10px] font-mono text-text-muted px-2 py-0.5 rounded-gallery bg-surface-elevated border border-border-subtle">
                    {assetAccounts.length} Accounts
                  </span>
                </div>
                <div className="space-y-2.5">
                  {assetAccounts.map((acc) => (
                    <div key={acc.id} className="flex justify-between items-center text-xs">
                      <div>
                        <div className="font-medium text-text">{acc.name}</div>
                        <div className="text-[10px] text-text-muted font-mono">{acc.accountNumber}</div>
                      </div>
                      <div className="font-mono font-bold tabular-nums text-text">
                        {formatCurrency(acc.balanceNaira)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Liability Accounts */}
              <div className="p-4 rounded-card border border-border-subtle bg-surface shadow-gallery space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <span className="text-xs font-semibold uppercase tracking-catalog text-amber-600 dark:text-amber-400">
                    Liabilities (Escrow & Payables)
                  </span>
                  <span className="text-[10px] font-mono text-text-muted px-2 py-0.5 rounded-gallery bg-surface-elevated border border-border-subtle">
                    {liabilityAccounts.length} Accounts
                  </span>
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {liabilityAccounts.slice(0, 10).map((acc) => (
                    <div key={acc.id} className="flex justify-between items-center text-xs">
                      <div>
                        <div className="font-medium text-text truncate max-w-[140px]">{acc.name}</div>
                        <div className="text-[10px] text-text-muted font-mono truncate max-w-[140px]">{acc.accountNumber}</div>
                      </div>
                      <div className="font-mono font-bold tabular-nums text-text">
                        {formatCurrency(acc.balanceNaira)}
                      </div>
                    </div>
                  ))}
                  {liabilityAccounts.length > 10 && (
                    <div className="text-[11px] text-text-muted text-center pt-1 font-light">
                      + {liabilityAccounts.length - 10} more collector/artist accounts
                    </div>
                  )}
                </div>
              </div>

              {/* Revenue Accounts */}
              <div className="p-4 rounded-card border border-border-subtle bg-surface shadow-gallery space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <span className="text-xs font-semibold uppercase tracking-catalog text-emerald-600 dark:text-emerald-400">
                    Revenue (Commissions)
                  </span>
                  <span className="text-[10px] font-mono text-text-muted px-2 py-0.5 rounded-gallery bg-surface-elevated border border-border-subtle">
                    {revenueAccounts.length} Accounts
                  </span>
                </div>
                <div className="space-y-2.5">
                  {revenueAccounts.map((acc) => (
                    <div key={acc.id} className="flex justify-between items-center text-xs">
                      <div>
                        <div className="font-medium text-text">{acc.name}</div>
                        <div className="text-[10px] text-text-muted font-mono">{acc.accountNumber}</div>
                      </div>
                      <div className="font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(acc.balanceNaira)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Journal Entries Stream */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-border-subtle">
              <span className="text-[11px] uppercase tracking-catalog font-medium text-text-muted">
                Immutable Journal Entries & Postings
              </span>
              <span className="text-xs font-mono text-text-muted">{journalEntries.length} recorded entries</span>
            </div>

            <div className="space-y-3">
              {journalEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-card border border-border-subtle bg-surface p-4 shadow-gallery space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border-subtle">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-gallery font-mono font-bold uppercase text-[10px] bg-surface-elevated text-text border border-border-subtle">
                        {entry.entryType}
                      </span>
                      <span className="font-serif italic font-medium text-sm text-text">{entry.description}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-text-muted">
                      <span className="font-mono">Ref: {entry.reference}</span>
                      <span className="font-mono tabular-nums">
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })}{" "}
                        UTC
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-gallery border border-border-subtle">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface-elevated text-text-muted uppercase text-[10px] tracking-catalog font-medium border-b border-border-subtle">
                        <tr>
                          <th className="py-2.5 px-3">Account Title</th>
                          <th className="py-2.5 px-3">Ledger Code</th>
                          <th className="py-2.5 px-3 text-right">Debit (Dr)</th>
                          <th className="py-2.5 px-3 text-right">Credit (Cr)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle bg-surface">
                        {entry.postings.map((p) => {
                          const isDebit = p.direction === "debit";
                          return (
                            <tr key={p.id} className="text-text hover:bg-surface-elevated/20 transition-colors">
                              <td className="py-2 px-3 font-medium flex items-center gap-1.5">
                                {isDebit ? (
                                  <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono font-bold">Dr.</span>
                                ) : (
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold pl-3">Cr.</span>
                                )}
                                <span>{p.accountName}</span>
                              </td>
                              <td className="py-2 px-3 font-mono text-text-muted text-[10px]">
                                {p.accountNumber}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-semibold tabular-nums text-text">
                                {isDebit ? formatCurrency(p.amount / 100) : "—"}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-semibold tabular-nums text-text">
                                {!isDebit ? formatCurrency(p.amount / 100) : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
