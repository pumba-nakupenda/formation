import { createClient } from "@/lib/supabase/client";

export interface Lesson {
    id: string;
    module_id: string;
    title: string;
    duration: string;
    video_url?: string;
    content?: string;
    order: number;
}

export interface Module {
    id: string;
    course_id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

export interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    price_fcfa: number;
    rating: number;
    instructor_name: string;
    duration: string;
    level: string;
    thumbnail_url?: string;
    modules?: Module[];
}

/**
 * Fetch all courses from Supabase
 */
export async function getCourses(): Promise<Course[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('courses')
        .select(`
            *,
            modules (
                *,
                lessons (*)
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching courses:", error);
        return [];
    }

    const courses = data as Course[];

    // Sort modules and lessons by 'order'
    courses.forEach(course => {
        if (course.modules) {
            course.modules.sort((a: any, b: any) => a.order - b.order);
            course.modules.forEach((mod: any) => {
                if (mod.lessons) {
                    mod.lessons.sort((a: any, b: any) => a.order - b.order);
                }
            });
        }
    });

    return courses;
}

/**
 * Fetch a single course with its modules and lessons
 */
export async function getCourseById(id: string): Promise<Course | null> {
    const supabase = createClient();

    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select(`
            *,
            modules (
                *,
                lessons (*)
            )
        `)
        .eq('id', id)
        .single();

    if (courseError) {
        console.error("Error fetching course:", courseError);
        return null;
    }

    // Sort modules and lessons by 'order'
    if (course.modules) {
        course.modules.sort((a: any, b: any) => a.order - b.order);
        course.modules.forEach((mod: any) => {
            if (mod.lessons) {
                mod.lessons.sort((a: any, b: any) => a.order - b.order);
            }
        });
    }

    return course as Course;
}

// Keeping this for build safety until DB is populated
export const mockCourses: Course[] = [
    {
        id: "marketing-digital-1",
        title: "Stratégie Web & Réseaux Sociaux",
        description: "Apprenez à bâtir une présence digitale forte et à attirer vos premiers clients via les réseaux sociaux.",
        category: "Marketing Digital",
        price_fcfa: 45000,
        rating: 4.9,
        instructor_name: "Babacar Diop",
        duration: "24h",
        level: "Débutant",
        modules: []
    }
];
