import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackSignature, fulfillPaystackDeposit } from "@/lib/paystack";

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("x-paystack-signature");

        if (!verifyPaystackSignature(rawBody, signature)) {
            return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
        }

        const event = JSON.parse(rawBody);

        if (event.event === "charge.success") {
            const data = event.data;
            const reference = data.reference;
            const amountInKobo = Math.round(Number(data.amount));
            const metadataUserId = data.metadata?.userId ? Number(data.metadata.userId) : undefined;

            await fulfillPaystackDeposit({
                reference,
                amountInKobo,
                userId: metadataUserId,
                req,
            });
        }

        return NextResponse.json({ status: "success" }, { status: 200 });
    } catch (error) {
        console.error("Paystack webhook error:", error);
        return NextResponse.json({ message: "Webhook handler error" }, { status: 500 });
    }
}
