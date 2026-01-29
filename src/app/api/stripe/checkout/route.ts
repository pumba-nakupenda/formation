import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { courseId, priceId, title } = await req.json();
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Non autorisé", { status: 401 });
        }

        // 1. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "xof",
                        product_data: {
                            name: title,
                            description: `Accès premium à la formation ${title}`,
                        },
                        unit_amount: 125000 * 100, // This should come from DB ideally
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=true`,
            metadata: {
                courseId: courseId,
                userId: user.id,
            },
            customer_email: user.email,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("[STRIPE_CHECKOUT_ERROR]", error);
        return new NextResponse("Erreur interne", { status: 500 });
    }
}
