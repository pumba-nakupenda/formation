-- Seed Data for LOLLY Platform
-- Use this script in the Supabase SQL Editor to add a sample course.

-- 1. Insert a Course
INSERT INTO public.courses (id, title, description, category, price_fcfa, instructor_name, duration, level, thumbnail_url, rating)
VALUES (
  '88888888-8888-4888-a888-888888888888', 
  'L''Art de la Stratégie Business', 
  'Découvrez les secrets des plus grands entrepreneurs pour bâtir un empire durable.', 
  'Business', 
  50000, 
  'Expert Lolly', 
  '12h', 
  'Intermédiaire', 
  'https://images.unsplash.com/photo-1507679799987-c7377bc565dc?q=80&w=2070&auto=format&fit=crop', 
  4.9
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert a Module
INSERT INTO public.modules (id, course_id, title, "order")
VALUES (
  '99999999-9999-4999-b999-999999999999', 
  '88888888-8888-4888-a888-888888888888', 
  'Introduction à la Stratégie', 
  1
) ON CONFLICT (id) DO NOTHING;

-- 3. Insert a Lesson
INSERT INTO public.lessons (id, module_id, title, duration, video_url, content, "order")
VALUES (
  'aaaaaaaa-aaaa-4aaa-baaa-aaaaaaaaaaaa', 
  '99999999-9999-4999-b999-999999999999', 
  'Bienvenue dans l''Academie Lolly', 
  '10', 
  'https://iframe.mediadelivery.net/embed/12345/abcdefg-hijk-lmn', 
  'Dans cette première leçon, nous allons poser les bases de votre réussite.', 
  1
) ON CONFLICT (id) DO NOTHING;
