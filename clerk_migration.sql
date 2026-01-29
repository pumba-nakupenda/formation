-- Fixed Migration to Clerk Authentication

-- 1. DROP ALL DEPENDENT POLICIES FIRST
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- 2. Drop foreign keys to auth.users
ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_instructor_id_fkey;
ALTER TABLE public.user_progress DROP CONSTRAINT IF EXISTS user_progress_user_id_fkey;
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE public.forum_posts DROP CONSTRAINT IF EXISTS forum_posts_user_id_fkey;
ALTER TABLE public.forum_replies DROP CONSTRAINT IF EXISTS forum_replies_user_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3. Change UUID columns to TEXT
ALTER TABLE public.courses ALTER COLUMN instructor_id TYPE TEXT;
ALTER TABLE public.user_progress ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.reviews ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.forum_posts ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.forum_replies ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.profiles ALTER COLUMN id TYPE TEXT;

-- 4. Clean up Supabase Auth Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 5. RE-CREATE POLICIES using Clerk-compatible check
CREATE POLICY "Users can view their own progress" ON public.user_progress 
FOR SELECT USING (user_id = (select auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update their own progress" ON public.user_progress 
FOR ALL USING (user_id = (select auth.jwt() ->> 'sub'));

CREATE POLICY "Authenticated users can create reviews" ON public.reviews 
FOR INSERT WITH CHECK (user_id = (select auth.jwt() ->> 'sub'));

CREATE POLICY "Authenticated users can create posts" ON public.forum_posts 
FOR INSERT WITH CHECK (user_id = (select auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own profile" ON public.profiles 
FOR UPDATE USING (id = (select auth.jwt() ->> 'sub'));

GRANT ALL ON TABLE public.user_progress TO authenticated;
GRANT ALL ON TABLE public.user_progress TO anon;
