"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Transaction, CollectorProfile } from "@/data/db";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import DepositModal from "@/components/DepositModal";


interface UserProfile extends CollectorProfile { }

import Pagination from "@/components/Pagination"; // Import Pagination component

interface ClientDepositPageProps {
    initialWalletBalance: number;
    initialTransactions: Transaction[];
    initialTotalTransactions: number; // Add initialTotalTransactions
    errors: string;
}

export default function ClientDepositPage({ initialWalletBalance, initialTransactions, initialTotalTransactions, errors }: ClientDepositPageProps) {
    const [loading, setLoading] = useState(false);
    const [walletBalance, setWalletBalance] = useState<number | null>(initialWalletBalance);
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [totalTransactions, setTotalTransactions] = useState<number>(initialTotalTransactions); // State for total transactions
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const transactionsPerPage = 10; // Number of transactions per page
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [error, setError] = useState<string | null>(errors);
    const [success, setSuccess] = useState<string | null>(null);

    const fetchTransactions = async (page: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/transactions?page=${page}&limit=${transactionsPerPage}`);
            if (!res.ok) {
                throw new Error("Failed to fetch transactions");
            }
            const data = await res.json();
            setTransactions(data.transactions);
            setTotalTransactions(data.totalCount);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Failed to load transaction history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions(currentPage);
    }, [currentPage]); // Refetch transactions when page changes

    const totalPages = Math.ceil(totalTransactions / transactionsPerPage);

    return (
        <div className="container mx-auto p-4 ">
            {error && (<div className={`bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-8 transition-transform animate-fade-in`} role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>)}
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white animate-fade-in">Deposit</h1>

            <div className="grid grid-cols-1 gap-6 mb-8 animate-fade-in-delay-1">
                {/* Current Balance Card */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 hover:scale-105 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Current Balance</h2>
                        <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                            ${walletBalance !== null ? walletBalance.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2}) : "N/A"}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Funds available for bidding and purchases.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:-translate-y-0.5"
                    >
                        Deposit Funds
                    </button>
                </div>

                {/* Placeholder for the removed Deposit Funds Form */}
                <div className="hidden md:block"></div> {/* This div maintains the grid layout */}
            </div>

            {/* Transaction History */}
            <div className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-fade-in-delay-2">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Transaction History</h2>
                {loading ? (
                    <LoadingSpinner />
                ) : transactions.length === 0 ? (
                    <EmptyState
                        title="No Auction Activity Yet"
                        message="It looks like you haven't made any deposits or withdrawals. Make a deposit to start bidding!"
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Reference
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {transaction.referenceNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                {transaction.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                {transaction.payType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                ${transaction.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                {new Date(transaction.transactionTime).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

            <DepositModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
