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
  const [walletBalance] = useState<number | null>(initialWalletBalance);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [totalTransactions, setTotalTransactions] = useState<number>(initialTotalTransactions);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(errors);

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
    <div className="space-y-6 animate-fade-in">
      {error && (
        <div
          className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Wallet & Deposit</h1>
        <p className="text-xs text-text-muted mt-1">Manage bidding funds and review transaction receipts</p>
      </div>

      {/* Balance Card */}
      <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-primary/10 text-primary">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider text-text-muted block">
              Available Bidding Balance
            </span>
            <span className="text-3xl font-extrabold tracking-tight text-text">
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
      <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-text">
            Transaction Activity
          </h2>
          <span className="text-xs text-text-muted">
            {totalTransactions} total entries
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border-subtle">
          <table className="min-w-full divide-y divide-border-subtle text-left text-xs">
            <thead className="bg-surface-elevated text-text-muted uppercase font-semibold tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3">Reference</th>
                <th scope="col" className="px-5 py-3">Description</th>
                <th scope="col" className="px-5 py-3">Type</th>
                <th scope="col" className="px-5 py-3">Amount</th>
                <th scope="col" className="px-5 py-3">Date</th>
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
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-surface-elevated transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono text-[11px] text-text-muted">
                      {transaction.transRef}
                    </td>
                    <td className="px-5 py-3.5 text-text font-medium">
                      {transaction.description || "Wallet Deposit"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-text">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-text-muted">
                      {new Date(transaction.createdAt || "").toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))
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
