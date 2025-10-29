'use client';
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Artwork } from "@/data/db";

export function PlaceBidForm({artwork} : {artwork: Artwork}) {
    const minBid = artwork.currentBid + 1;
    const [bidAmount, setBidAmount] = useState<number>(minBid);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);
    const router = useRouter();


    const parseNumber = (str: string) => {
        const cleaned = str.replace(/[^0-9.]/g, '');
        return Number(cleaned);
    };

    const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const newCursorPosition = e.target.selectionStart;

        const oldFormattedValue = formattedBidAmount;
        // const oldRawValue = parseNumber(oldFormattedValue);

        const newRawValue = parseNumber(inputValue);

        setBidAmount(newRawValue);

        
        if (inputRef.current && newCursorPosition !== null) {
            const numNonDigitsOld = (oldFormattedValue.slice(0, newCursorPosition).match(/[^0-9.]/g) || []).length;
            const numNonDigitsNew = (inputValue.slice(0, newCursorPosition).match(/[^0-9.]/g) || []).length;
            setCursorPosition(newCursorPosition + (numNonDigitsNew - numNonDigitsOld));
        }
    };

    const handlePredefinedBid = (amount: number) => {
        setBidAmount(prevAmount => prevAmount + amount);
        setCursorPosition(null); 
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (bidAmount < minBid) {
            setError(`Bid amount must be at least $${minBid.toLocaleString()}.`);
            return;
        }

        try {
            const response = await fetch(`/api/artworks/${artwork.id}/bid`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: bidAmount }),
            });

            if (response.ok) {
                setSuccessMessage("Bid placed successfully!");
                
                router.refresh(); 
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to place bid.");
            }
        } catch (err: unknown) {
            setError((err as Error).message || "An unexpected error occurred.");
        }
    };

    
    const getPreiledBidOptions = (currentBid: number) => {
        if (currentBid < 100) {
            return [5, 10, 20, 50];
        } else if (currentBid < 1000) {
            return [25, 50, 100, 250];
        } else if (currentBid < 5000) {
            return [100, 250, 500, 1000];
        } else {
            return [250, 500, 1000, 2500];
        }
    };

    const predefinedOptions = useMemo(() => getPreiledBidOptions(artwork.currentBid), [artwork.currentBid]);

    const formattedBidAmount = useMemo(() => {
        return bidAmount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }, [bidAmount]);

    useEffect(() => {
        if (inputRef.current && cursorPosition !== null) {
            inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
        }
    }, [cursorPosition, inputRef]);
    return (
        <div className="xl:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">Your Bid</h2>
            <form className="flex flex-col gap-6 flex-grow" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline"> {successMessage}</span>
                    </div>
                )}
                <div>
                    <label htmlFor="bidAmount" className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Enter your bid amount
                    </label>
                    <input
                        type="text"
                        id="bidAmount"
                        name="bidAmount"
                        ref={inputRef}
                        value={formattedBidAmount}
                        onChange={handleBidChange}
                        placeholder={`Minimum bid: $${minBid.toLocaleString()}`}
                        className="w-full p-3 border border-gray-300 rounded-lg text-2xl text-center font-bold focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-4">
                    {predefinedOptions.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handlePredefinedBid(option)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                        >
                            +${option}
                        </button>
                    ))}
                </div>

                <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75 text-xl"
                >
                    Place Bid
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                    You will be notified if you are outbid.
                </p>
            </form>
        </div>
    );
}
