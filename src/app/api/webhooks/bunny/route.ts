import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Bunny.net Webhook Handler
 * Doc: https://docs.bunny.net/docs/stream-webhook
 */
export async function POST(request: Request) {
    try {
        // Initialize Supabase inside the request handler to avoid build-time errors
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const body = await request.json();
        const { TriggeredBy, VideoGuid, VideoLibraryId, Status } = body;

        console.log(`[BUNNY_WEBHOOK] Event received: Status=${Status}, VideoGuid=${VideoGuid}`);

        // Status 4 = Finished (Encoded & Ready)
        if (Status === 4) {
            console.log(`[BUNNY_WEBHOOK] Video ${VideoGuid} is ready. Processing upsert...`);

            // 1. Fetch Video Details from Bunny API to get Title, Duration, etc.
            const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
            const videoResponse = await fetch(`https://video.bunnycdn.com/library/${VideoLibraryId}/videos/${VideoGuid}`, {
                headers: { 'AccessKey': BUNNY_API_KEY! }
            });

            if (!videoResponse.ok) {
                console.error(`[BUNNY_WEBHOOK] Failed to fetch video details from Bunny API`);
                return NextResponse.json({ error: "Failed to fetch video details" }, { status: 500 });
            }

            const video = await videoResponse.json();
            
            // 2. Identify or Create Course (using Library Name/ID logic)
            // Since courses.id is UUID, we can't force VideoLibraryId into it directly unless it's a UUID.
            // We'll try to find a course that might match, or create a generic one.
            
            // Fetch library name for the course title
            const libResponse = await fetch(`https://api.bunny.net/videolibrary/${VideoLibraryId}`, {
                headers: { 'AccessKey': BUNNY_API_KEY! }
            });
            const lib = await libResponse.json();
            const courseTitle = lib.Name || 'Nouvelle Formation Bunny';

            // Try to find existing course by title to avoid duplicates
            let { data: course } = await supabaseAdmin
                .from('courses')
                .select('*')
                .eq('title', courseTitle)
                .single();

            if (!course) {
                // Create new course if not found
                const { data: newCourse, error: courseError } = await supabaseAdmin
                    .from('courses')
                    .insert({
                        title: courseTitle,
                        category: 'Management',
                        instructor_name: 'Expert LOLLY',
                        description: `Formation importée depuis Bunny (Lib: ${VideoLibraryId})`
                    })
                    .select()
                    .single();
                
                if (courseError) throw new Error(`Course creation failed: ${courseError.message}`);
                course = newCourse;
            }

            // 3. Ensure Module exists
            let { data: module } = await supabaseAdmin
                .from('modules')
                .select('*')
                .eq('course_id', course.id)
                .eq('title', 'PARCOURS STRATÉGIQUE')
                .single();

            if (!module) {
                const { data: newModule, error: moduleError } = await supabaseAdmin
                    .from('modules')
                    .insert({
                        course_id: course.id,
                        title: 'PARCOURS STRATÉGIQUE',
                        order: 1
                    })
                    .select()
                    .single();

                if (moduleError) throw new Error(`Module creation failed: ${moduleError.message}`);
                module = newModule;
            }

            // 4. Create/Update Lesson
            // We use the embed URL as a unique identifier or the title since IDs are UUIDs
            const embedUrl = `https://iframe.mediadelivery.net/embed/${VideoLibraryId}/${VideoGuid}`;
            
            // Check if lesson exists by video_url (which contains the GUID)
            const { data: existingLesson } = await supabaseAdmin
                .from('lessons')
                .select('id')
                .eq('video_url', embedUrl)
                .single();

            if (!existingLesson) {
                 const { error: lessonError } = await supabaseAdmin
                .from('lessons')
                .insert({
                    module_id: module.id, // Use the valid UUID from the module
                    title: video.title || 'Nouvelle Leçon',
                    video_url: embedUrl,
                    duration: Math.round(video.length / 60).toString() || "10",
                    order: 0, // You might want to query max order + 1 here
                    content: "Contenu synchronisé automatiquement depuis Bunny."
                });

                if (lessonError) {
                    console.error(`[BUNNY_WEBHOOK] Lesson insert error:`, lessonError);
                    return NextResponse.json({ error: lessonError.message }, { status: 500 });
                }
            } else {
                console.log(`[BUNNY_WEBHOOK] Lesson already exists for video ${VideoGuid}, skipping.`);
            }

            console.log(`[BUNNY_WEBHOOK] Successfully synced video: ${video.title}`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(`[BUNNY_WEBHOOK] Error:`, error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
