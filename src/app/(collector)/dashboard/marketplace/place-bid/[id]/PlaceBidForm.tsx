'use client';
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Artwork } from "@/types";

export function PlaceBidForm({ artwork, errors }: { artwork: Artwork, errors: string }) {
    const minBid = (artwork.currentBid && artwork.currentBid > 0 ? artwork.currentBid : artwork.startingBid) + 1;
    const [currentBid, setCurrentBid] = useState(0);
    const [bidAmount, setBidAmount] = useState<number>(minBid);
    const [error, setError] = useState<string | null>(errors);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/profile')
        .then(res => res.json())
        .then(json => {
            setWalletBalance(json.wallet)
        })
    }, []);

    const parseNumber = (str: string) => {
        const cleaned = str.replace(/[^0-9.]/g, '');
        return Number(cleaned);
    };

    const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const newCursorPosition = e.target.selectionStart;
        const oldFormattedValue = formattedBidAmount;
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
        setError(null);
        setSuccessMessage(null);

        if (bidAmount < minBid) {
            setError(`Bid amount must be at least $${minBid.toLocaleString()}.`);
            event.preventDefault();
            return;
        }

        if (bidAmount > walletBalance) {
            console.log(1)
            setError("Insufficient funds. Please deposit more to your wallet.");
            event.preventDefault();
            router.push("/dashboard/deposit");
            return;
        }
    };


    const getPreiledBidOptions = (currentBid: number) => {
        return [0.05 * currentBid, 0.10 * currentBid, 0.25 * currentBid, 0.50 * currentBid].map(num => num > 10 ? Math.round(0.1 * num) * 10 : Math.round(num * 100) * 0.01);
    };

    const predefinedOptions = useMemo(() => getPreiledBidOptions((artwork.currentBid && artwork.currentBid > 0) ? artwork.currentBid : artwork.startingBid), [artwork.currentBid, artwork.startingBid]);

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

    useEffect(() => {
        fetch(`/api/bid?artworkId=${artwork.id}`)
        .then(res => res.json())
        .then(json => {
            setCurrentBid(json.bidAmount)
        })
    }, [artwork.id]);

    return (
        <div className="xl:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
            {currentBid > 0 && <div className="my-8 w-full flex justify-end">
                <span className="text-xl font-extrabold bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">Your current bid: ${currentBid.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>}
            <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">Your Bid</h2>
            <form method="POST" action={`/api/artworks/${artwork.id}/bid`} className="flex flex-col gap-6 flex-grow" onSubmit={handleSubmit}>
                {error && (<div className={`bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-8 transition-transform animate-fade-in`} role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>)}
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
