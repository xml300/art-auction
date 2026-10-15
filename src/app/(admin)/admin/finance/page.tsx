"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  AlertOctagon,
  Loader2,
  ArrowDownRight,
  ArrowUpRight,
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
          <span className="text-xs uppercase font-bold tracking-wider text-primary">
            Financial Ledger System
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-text">
            Double-Entry Accounting Oversight
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Immutable journal entries, trial balance validation, and escrow custody.
          </p>
        </div>
      </div>

      {/* Trial Balance Invariant Verification Card */}
      <div
        className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isBalanced
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-950 dark:text-emerald-100"
            : "bg-rose-500/5 border-rose-500/20 text-rose-950 dark:text-rose-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${
              isBalanced
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            {isBalanced ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertOctagon className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-2">
              <span>Trial Balance Equation:</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isBalanced
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}
              >
                {isBalanced ? "Debits = Credits (Strict Invariant Preserved)" : "Out of Balance"}
              </span>
            </div>
            <p className="text-xs opacity-80 mt-1">
              Recorded Postings: Total Debits = {formatCurrency(totalDebits / 100)} | Total Credits = {formatCurrency(totalCredits / 100)}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-3 text-text-muted">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-xs">Loading ledger balance sheets...</span>
        </div>
      ) : (
        <>
          {/* Chart of Accounts Balance Summary */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold tracking-tight text-text uppercase text-text-muted">
              Chart of Accounts (Live Balances)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Asset Accounts */}
              <div className="p-4 rounded-2xl border border-border-subtle bg-surface space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Assets (Custody & Gateway)
                  </span>
                  <span className="text-[10px] font-semibold text-text-muted px-2 py-0.5 rounded-full bg-surface-elevated">
                    {assetAccounts.length} Accounts
                  </span>
                </div>
                <div className="space-y-2">
                  {assetAccounts.map((acc) => (
                    <div key={acc.id} className="flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-text">{acc.name}</div>
                        <div className="text-[10px] text-text-muted font-mono">{acc.accountNumber}</div>
                      </div>
                      <div className="font-mono font-bold text-text">
                        {formatCurrency(acc.balanceNaira)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Liability Accounts */}
              <div className="p-4 rounded-2xl border border-border-subtle bg-surface space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Liabilities (User Balances & Escrow)
                  </span>
                  <span className="text-[10px] font-semibold text-text-muted px-2 py-0.5 rounded-full bg-surface-elevated">
                    {liabilityAccounts.length} Accounts
                  </span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {liabilityAccounts.slice(0, 10).map((acc) => (
                    <div key={acc.id} className="flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-text truncate max-w-[140px]">{acc.name}</div>
                        <div className="text-[10px] text-text-muted font-mono truncate max-w-[140px]">{acc.accountNumber}</div>
                      </div>
                      <div className="font-mono font-bold text-text">
                        {formatCurrency(acc.balanceNaira)}
                      </div>
                    </div>
                  ))}
                  {liabilityAccounts.length > 10 && (
                    <div className="text-[11px] text-text-muted text-center pt-1">
                      + {liabilityAccounts.length - 10} more collector/artist accounts
                    </div>
                  )}
                </div>
              </div>

              {/* Revenue Accounts */}
              <div className="p-4 rounded-2xl border border-border-subtle bg-surface space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Revenue (Platform Commissions)
                  </span>
                  <span className="text-[10px] font-semibold text-text-muted px-2 py-0.5 rounded-full bg-surface-elevated">
                    {revenueAccounts.length} Accounts
                  </span>
                </div>
                <div className="space-y-2">
                  {revenueAccounts.map((acc) => (
                    <div key={acc.id} className="flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-text">{acc.name}</div>
                        <div className="text-[10px] text-text-muted font-mono">{acc.accountNumber}</div>
                      </div>
                      <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
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
            <h3 className="text-sm font-bold tracking-tight text-text uppercase text-text-muted">
              Immutable Journal Entries & Postings
            </h3>

            <div className="space-y-3">
              {journalEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-subtle">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono font-bold uppercase text-[10px] bg-primary/10 text-primary border border-primary/20">
                        {entry.entryType}
                      </span>
                      <span className="font-bold text-xs text-text">{entry.description}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-text-muted">
                      <span className="font-mono">Ref: {entry.reference}</span>
                      <span>
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-text-muted font-medium text-[11px]">
                          <th className="pb-1 px-2">Account</th>
                          <th className="pb-1 px-2">Account Number</th>
                          <th className="pb-1 px-2">Direction</th>
                          <th className="pb-1 px-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle/50">
                        {entry.postings.map((p) => (
                          <tr key={p.id} className="text-text">
                            <td className="py-1 px-2 font-medium">{p.accountName}</td>
                            <td className="py-1 px-2 font-mono text-text-muted text-[10px]">
                              {p.accountNumber}
                            </td>
                            <td className="py-1 px-2">
                              {p.direction === "debit" ? (
                                <span className="inline-flex items-center gap-0.5 text-sky-600 dark:text-sky-400 font-bold uppercase text-[10px]">
                                  <ArrowDownRight className="w-3 h-3" />
                                  Debit
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px]">
                                  <ArrowUpRight className="w-3 h-3" />
                                  Credit
                                </span>
                              )}
                            </td>
                            <td className="py-1 px-2 text-right font-mono font-bold">
                              {formatCurrency(p.amount / 100)}
                            </td>
                          </tr>
                        ))}
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
