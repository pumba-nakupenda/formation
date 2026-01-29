import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Load API Key from env
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;

export async function GET() {
    // Collecte des logs pour retour utilisateur
    const logs: string[] = [];

    // Safety check for critical variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
        return NextResponse.json({
            success: false,
            error: "Configuration URL absente.",
            logs: ["❌ Erreur : NEXT_PUBLIC_SUPABASE_URL est manquante."]
        }, { status: 500 });
    }

    // Initialize Supabase inside the request to avoid environment caching issues
    const supabase = createClient(supabaseUrl, supabaseKey!);

    if (!BUNNY_API_KEY) {
        return NextResponse.json({
            success: false,
            error: "BUNNY_API_KEY non configurée",
            logs: ["❌ Erreur : BUNNY_API_KEY est manquante dans .env.local"]
        }, { status: 500 });
    }

    try {
        logs.push("🚀 Début de la synchronisation Bunny.net...");

        // 1. Fetch Video Libraries
        const librariesResponse = await fetch('https://api.bunny.net/videolibrary', {
            headers: { 'AccessKey': BUNNY_API_KEY }
        });

        if (!librariesResponse.ok) {
            const errorText = await librariesResponse.text();
            throw new Error(`Erreur Bunny API (Libraries): ${librariesResponse.status} - ${errorText}`);
        }

        const libraries = await librariesResponse.json();
        logs.push(`✅ ${libraries.length} bibliothèques trouvées sur votre compte.`);

        let coursesSynced = 0;
        let lessonsSynced = 0;

        for (const lib of libraries) {
            logs.push(`📂 Traitement : "${lib.Name}" (ID: ${lib.Id})`);

            // 2. Upsert Course
            const { data: course, error: courseError } = await supabase
                .from('courses')
                .upsert({
                    id: lib.Id.toString(),
                    title: lib.Name,
                    description: `Exploration des stratégies de ${lib.Name}. Découvrez les secrets de l'excellence sur LOLLY.`,
                    category: 'Formation',
                    instructor_name: 'Expert LOLLY',
                    price_fcfa: 125000,
                    level: 'Tous niveaux'
                }, { onConflict: 'id' })
                .select()
                .single();

            if (courseError) {
                logs.push(`   ❌ Échec cours : ${courseError.message}`);
                continue;
            }
            coursesSynced++;

            // 3. Ensure Module
            const { data: module, error: moduleError } = await supabase
                .from('modules')
                .upsert({
                    course_id: course.id,
                    title: 'PARCOURS STRATÉGIQUE',
                    order: 1
                }, { onConflict: 'course_id, title' })
                .select()
                .single();

            const activeModuleId = module?.id || (await supabase
                .from('modules')
                .select('id')
                .eq('course_id', course.id)
                .eq('title', 'PARCOURS STRATÉGIQUE')
                .single()).data?.id;

            if (!activeModuleId) {
                logs.push(`   ⚠️ Impossible de créer le module, vidéos ignorées.`);
                continue;
            }

            // 4. Fetch Videos
            const videosResponse = await fetch(`https://video.bunnycdn.com/library/${lib.Id}/videos`, {
                headers: { 'AccessKey': BUNNY_API_KEY }
            });

            if (!videosResponse.ok) {
                logs.push(`   ⚠️ Erreur Bunny API (Videos) : ${videosResponse.status}`);
                continue;
            }

            const videosData = await videosResponse.json();
            const videos = videosData.items || [];
            logs.push(`   🎥 ${videos.length} vidéos détectées.`);

            for (const video of videos) {
                const embedUrl = `https://iframe.mediadelivery.net/embed/${lib.Id}/${video.guid}`;
                const { error: lessonError } = await supabase
                    .from('lessons')
                    .upsert({
                        id: video.guid,
                        module_id: activeModuleId,
                        title: video.title || 'Sans titre',
                        video_url: embedUrl,
                        duration: Math.round(video.length / 60).toString() || "10",
                        order: 0,
                        content: "Apprenez les méthodologies gagnantes sur LOLLY."
                    }, { onConflict: 'id' });

                if (lessonError) {
                    logs.push(`      ❌ Erreur leçon "${video.title}" : ${lessonError.message}`);
                } else {
                    lessonsSynced++;
                }
            }

            // Update thumbnail
            if (videos.length > 0) {
                const thumb = `https://vz-7429b478-f73.b-cdn.net/${videos[0].guid}/thumbnail.jpg`;
                await supabase.from('courses').update({ thumbnail_url: thumb }).eq('id', course.id);
            }
        }

        const summary = `SYNCHRONISATION TERMINÉE : ${coursesSynced} formations et ${lessonsSynced} leçons.`;
        logs.push(`🏁 ${summary}`);

        return NextResponse.json({
            success: true,
            courses_synced: coursesSynced,
            lessons_synced: lessonsSynced,
            details: summary,
            logs: logs
        });

    } catch (error: any) {
        console.error("CRITICAL Sync Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            logs: logs,
            detail: "Une erreur critique est survenue."
        }, { status: 500 });
    }
}
