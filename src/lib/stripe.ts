import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
    if (!stripeInstance) {
        // If the key is missing during build time, we should probably not crash 
        // unless we are actually trying to use it.
        // However, this function is called at runtime.
        const key = process.env.STRIPE_SECRET_KEY;
        
        if (!key) {
             // Fallback for build time to prevent "Neither apiKey" error if this gets evaluated?
             // But really, we want to throw if it's missing at runtime.
             console.warn("STRIPE_SECRET_KEY is missing. Stripe features will fail.");
             throw new Error("STRIPE_SECRET_KEY is missing");
        }

        stripeInstance = new Stripe(key, {
            apiVersion: '2026-01-28.clover' as any, // Cast to any to avoid TS errors with mismatched library versions
            typescript: true,
        });
    }
    return stripeInstance;
}