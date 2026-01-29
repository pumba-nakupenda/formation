-- Update IDs to TEXT to accommodate Bunny.net and other external providers
-- 1. Drop existing foreign keys
ALTER TABLE public.modules DROP CONSTRAINT IF EXISTS modules_course_id_fkey;
ALTER TABLE public.lessons DROP CONSTRAINT IF EXISTS lessons_module_id_fkey;
ALTER TABLE public.user_progress DROP CONSTRAINT IF EXISTS user_progress_lesson_id_fkey;
ALTER TABLE public.user_progress DROP CONSTRAINT IF EXISTS user_progress_course_id_fkey;
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_course_id_fkey;

-- 2. Change columns to TEXT
ALTER TABLE public.courses ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.modules ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.modules ALTER COLUMN course_id TYPE TEXT;
ALTER TABLE public.lessons ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.lessons ALTER COLUMN module_id TYPE TEXT;
ALTER TABLE public.user_progress ALTER COLUMN lesson_id TYPE TEXT;
ALTER TABLE public.user_progress ALTER COLUMN course_id TYPE TEXT;
ALTER TABLE public.reviews ALTER COLUMN course_id TYPE TEXT;

-- 3. Re-add foreign keys
ALTER TABLE public.modules ADD CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
ALTER TABLE public.lessons ADD CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;
ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;
ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- 4. Add unique constraint for idempotent sync
ALTER TABLE public.modules DROP CONSTRAINT IF EXISTS modules_course_id_title_key;
ALTER TABLE public.modules ADD CONSTRAINT modules_course_id_title_key UNIQUE (course_id, title);
