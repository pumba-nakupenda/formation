import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = createClient();

    // 1. CLEAR ALL PREVIOUS DATA to avoid confusion
    const { data: allCourses } = await supabase.from('courses').select('id');
    if (allCourses && allCourses.length > 0) {
        await supabase.from('courses').delete().in('id', allCourses.map(c => c.id));
    }

    // 3. Create Multiple Courses
    const coursesData = [
        {
            title: "LOLLY PREMIUM : Stratégie & Croissance",
            description: "Le programme complet pour transformer votre business.",
            category: "Business",
            price_fcfa: 125000,
            instructor_name: "Jean-Marc Lolly",
            duration: "20h",
            level: "Expert",
            rating: 4.9,
            thumbnail_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1000"
        },
        {
            title: "UI/UX Design Mastery",
            description: "Créez des interfaces modernes et engageantes.",
            category: "Design",
            price_fcfa: 85000,
            instructor_name: "Sarah Connors",
            duration: "15h",
            level: "Intermédiaire",
            rating: 4.8,
            thumbnail_url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1000"
        },
        {
            title: "Intelligence Artificielle pour Leaders",
            description: "Comprendre et intégrer l'IA dans votre entreprise.",
            category: "Tech",
            price_fcfa: 95000,
            instructor_name: "Dr. Alan T.",
            duration: "12h",
            level: "Débutant",
            rating: 4.7,
            thumbnail_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000"
        }
    ];

    for (const courseData of coursesData) {
        const { data: course, error } = await supabase.from('courses').insert(courseData).select().single();
        if (error) continue;

        // Add a demo module for each
        const { data: module } = await supabase.from('modules').insert({
            course_id: course.id,
            title: "Module 1 : Introduction",
            order: 1
        }).select().single();

        if (module) {
            await supabase.from('lessons').insert([
                {
                    module_id: module.id,
                    title: "Leçon 01 : Les Bases",
                    duration: "10",
                    order: 1,
                    video_url: "/videos/Timeline 1.mp4",
                    content: "Introduction au cours."
                }
            ]);
        }
    }

    return NextResponse.json({
        success: true,
        message: "Data synchronisée avec succès. Plusieurs cours générés.",
    });
}
