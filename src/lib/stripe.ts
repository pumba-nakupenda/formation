import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
    if (!stripeInstance) {
        let key = process.env.STRIPE_SECRET_KEY;
        
        if (!key) {
             console.warn("⚠️ STRIPE_SECRET_KEY is missing. Using a placeholder for build purposes.");
             // Placeholder to prevent build crash. Runtime calls will fail (as they should) if key is invalid.
             key = "sk_test_placeholder_for_build"; 
        }

        stripeInstance = new Stripe(key, {
            apiVersion: '2026-01-28.clover' as any,
            typescript: true,
        });
    }
    return stripeInstance;
}