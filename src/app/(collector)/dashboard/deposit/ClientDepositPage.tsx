"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/types";
import EmptyState from "@/components/EmptyState";
import DepositModal from "@/components/DepositModal";
import Pagination from "@/components/Pagination";
import { formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { PlusCircle, Wallet, AlertCircle } from "lucide-react";

interface ClientDepositPageProps {
  initialWalletBalance: number;
  initialTransactions: Transaction[];
  initialTotalTransactions: number;
  errors: string;
}

export default function ClientDepositPage({
  initialWalletBalance,
  initialTransactions,
  initialTotalTransactions,
  errors,
}: ClientDepositPageProps) {
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(initialWalletBalance);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [totalTransactions, setTotalTransactions] = useState<number>(initialTotalTransactions);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(errors);

  useEffect(() => {
    setWalletBalance(initialWalletBalance);
  }, [initialWalletBalance]);

  const fetchTransactions = async (page: number) => {
    setLoading(true);
    try {
      const res = await api.get<{ transactions: Transaction[]; totalCount: number }>(
        `/transactions?page=${page}&limit=${transactionsPerPage}`
      );
      setTransactions(res.transactions);
      setTotalTransactions(res.totalCount);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transaction history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {error && (
        <div
          className="p-3.5 rounded-card bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="border-b border-border-subtle pb-4">
        <span className="text-[11px] uppercase tracking-catalog font-medium text-text-muted">
          Financial Management
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif italic text-text mt-0.5">
          Wallet & Escrow Balance
        </h1>
        <p className="text-xs text-text-muted mt-1 font-light">
          Manage your verified bidding balance and review itemized ledger records.
        </p>
      </div>

      {/* Balance Card */}
      <div className="rounded-card border border-border-subtle bg-surface p-6 shadow-gallery flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-gallery bg-surface-elevated border border-border-subtle text-accent">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-catalog font-medium text-text-muted block">
              Available Bidding Capital
            </span>
            <span className="text-3xl font-mono font-bold tracking-tight text-text tabular-nums">
              {walletBalance !== null ? formatCurrency(walletBalance) : "₦0.00"}
            </span>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Deposit Funds
        </Button>
      </div>

      {/* Transaction History Table */}
      <div className="rounded-card border border-border-subtle bg-surface p-6 shadow-gallery space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <span className="text-[10px] uppercase tracking-catalog font-medium text-text-muted block">
              Audit Trail
            </span>
            <h2 className="text-lg font-serif italic text-text">
              Transaction History
            </h2>
          </div>
          <span className="text-xs text-text-muted font-mono tabular-nums">
            {totalTransactions} total entries
          </span>
        </div>

        <div className="overflow-x-auto rounded-gallery border border-border-subtle">
          <table className="min-w-full divide-y divide-border-subtle text-left text-xs">
            <thead className="bg-surface-elevated text-text-muted uppercase text-[10px] tracking-catalog font-medium">
              <tr>
                <th scope="col" className="px-5 py-3">Reference</th>
                <th scope="col" className="px-5 py-3">Description</th>
                <th scope="col" className="px-5 py-3">Type</th>
                <th scope="col" className="px-5 py-3 text-right">Amount</th>
                <th scope="col" className="px-5 py-3 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface">
              {loading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12">
                    <EmptyState
                      title="No Transactions Found"
                      message="Fund your wallet to participate in live auctions."
                    />
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => {
                  const isDeposit = transaction.type?.toLowerCase().includes("deposit");
                  const isBidHold = transaction.type?.toLowerCase().includes("hold");

                  return (
                    <tr
                      key={transaction.id}
                      className="hover:bg-surface-elevated/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-mono text-[11px] text-text-muted">
                        {transaction.transRef}
                      </td>
                      <td className="px-5 py-3.5 text-text font-medium">
                        {transaction.description || "Wallet Deposit"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-gallery text-[10px] uppercase tracking-wider font-semibold border ${
                            isDeposit
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : isBidHold
                              ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                              : "bg-surface-elevated text-text-muted border-border-subtle"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className={`px-5 py-3.5 text-right font-mono font-semibold tabular-nums ${
                        isDeposit
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-text"
                      }`}>
                        {isDeposit ? `+${formatCurrency(transaction.amount)}` : `-${formatCurrency(transaction.amount)}`}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-[11px] text-text-muted tabular-nums">
                        {new Date(transaction.createdAt || "").toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && !loading && (
          <div className="pt-2 flex justify-center sm:justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <DepositModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
