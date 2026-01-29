-- Helper Script : Synchronisation Prix Stripe
-- À exécuter après avoir créé vos produits dans Stripe Dashboard

-- Exemple : Mettre à jour les prix réels et IDs Stripe
UPDATE public.courses SET 
  price_fcfa = 125000, 
  stripe_price_id = 'price_1Q...' -- Remplacez par votre ID Stripe
WHERE title ILIKE '%Business%';

UPDATE public.courses SET 
  price_fcfa = 85000, 
  stripe_price_id = 'price_1B...' -- Remplacez par votre ID Stripe
WHERE title ILIKE '%Marketing%';

-- Note : Par défaut, les cours sans stripe_price_id ne pourront pas lancer de checkout.
