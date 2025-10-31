import { CollectorProfile, getUsersProfile, getTransactions } from "@/data/db";
import { getSession } from "@/lib/auth"; 
import { redirect } from "next/navigation";
import ClientDepositPage from "./ClientDepositPage"; // A new client component to hold client-side logic
import { cookies } from "next/headers";
 
async function getInitialData() {
    const [payload, error] = await getSession();

    if (error || payload === null) {
        redirect('/auth'); // Redirect to login if not authenticated
    }

    const userId = payload.userId;
    const profileData = getUsersProfile(userId) as CollectorProfile;
    const { transactions, totalCount } = getTransactions(userId, { sortBy: 'transactionTime', sortOrder: 'desc', page: 1, limit: 10 }); // Fetch initial paginated data

    return {
        walletBalance: profileData.wallet,
        transactions: transactions,
        totalTransactions: totalCount, // Pass totalCount
    };
}

export default async function DepositPage() {
    const { walletBalance, transactions, totalTransactions } = await getInitialData();
    const cookie = cookies();
    const errors = (await cookie).get('errors')?.value;

    return (
        <ClientDepositPage
            initialWalletBalance={walletBalance}
            initialTransactions={transactions}
            initialTotalTransactions={totalTransactions} // Pass initialTotalTransactions
            errors={errors || ""}
        />
    );
}
