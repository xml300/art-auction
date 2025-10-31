"use client";

import { useState } from "react"; 

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DepositModal({
    isOpen,
    onClose
}: DepositModalProps) {
    const [amount, setAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDeposit = async ( ) => {
        // e.preventDefault();
        setIsProcessing(true);
    };

    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-screen w-screen z-50 flex justify-center items-center animate-fade-in">
            <div onClick={(e) => e.stopPropagation()} className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl p-6 sm:p-8 m-4 max-w-lg w-full transform transition-all duration-300 scale-95 opacity-0 animate-scale-in border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Deposit Funds</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 p-2 -mr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form method="POST" action="/api/deposit" onSubmit={handleDeposit}>
                    <div className="mb-6">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Amount to Deposit
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 appearance-none"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g., 50.00"
                            min="50.00"
                            step="0.01"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:-translate-y-1 active:translate-y-0"
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Processing..." : "Confirm Deposit"}
                    </button>
                </form>
            </div>
        </div>
    );
}
