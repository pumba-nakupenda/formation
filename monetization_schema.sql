-- Monetization Schema Update

-- 1. Add Stripe ID to Courses
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- 2. Create User Purchases Table
CREATE TABLE IF NOT EXISTS public.user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  stripe_session_id TEXT,
  amount_paid INTEGER,
  currency TEXT DEFAULT 'XOF',
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 3. Enable RLS
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- 4. Policies
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.user_purchases;
CREATE POLICY "Users can view their own purchases" ON public.user_purchases FOR SELECT USING (auth.uid() = user_id);

-- 5. Admin can see everyone
DROP POLICY IF EXISTS "Admin can view all purchases" ON public.user_purchases;
CREATE POLICY "Admin can view all purchases" ON public.user_purchases FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
