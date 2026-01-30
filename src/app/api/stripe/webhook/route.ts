import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const stripe = getStripe();
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === "checkout.session.completed") {
        const userId = session?.metadata?.userId;
        const courseId = session?.metadata?.courseId;

        if (!userId || !courseId) {
            return new NextResponse("Webhook Error: Missing metadata", { status: 400 });
        }

        const supabase = await createClient();

        // 1. Record the purchase
        const { error: purchaseError } = await supabase
            .from("user_purchases")
            .insert({
                user_id: userId,
                course_id: courseId,
                stripe_session_id: session.id,
                amount_paid: session.amount_total,
                currency: session.currency,
                status: "completed"
            });

        if (purchaseError) {
            console.error("[WEBHOOK_PURCHASE_ERROR]", purchaseError);
            return new NextResponse("Erreur d'enregistrement", { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
