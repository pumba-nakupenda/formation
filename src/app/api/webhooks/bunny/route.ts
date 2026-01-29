import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Bunny.net Webhook Handler
 * Doc: https://docs.bunny.net/docs/stream-webhook
 */
export async function POST(request: Request) {
    try {
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

            // 2. Identify or Create Course (using Library Name as default)
            // Note: For a more advanced setup, we would use Collections as Courses.
            const libResponse = await fetch(`https://api.bunny.net/videolibrary/${VideoLibraryId}`, {
                headers: { 'AccessKey': BUNNY_API_KEY! }
            });
            const lib = await libResponse.json();

            const { data: course } = await supabaseAdmin
                .from('courses')
                .upsert({
                    id: VideoLibraryId.toString(),
                    title: lib.Name || 'Nouvelle Formation',
                    category: 'Management',
                    instructor_name: 'Expert LOLLY'
                }, { onConflict: 'id' })
                .select()
                .single();

            if (!course) throw new Error("Course upsert failed");

            // 3. Ensure Module exists
            const { data: module } = await supabaseAdmin
                .from('modules')
                .upsert({
                    course_id: course.id,
                    title: 'PARCOURS STRATÉGIQUE',
                    order: 1
                }, { onConflict: 'course_id, title' })
                .select()
                .single();

            const moduleId = module?.id || (await supabaseAdmin
                .from('modules')
                .select('id')
                .eq('course_id', course.id)
                .single()).data?.id;

            // 4. Upsert Lesson
            const embedUrl = `https://iframe.mediadelivery.net/embed/${VideoLibraryId}/${VideoGuid}`;

            const { error: lessonError } = await supabaseAdmin
                .from('lessons')
                .upsert({
                    id: VideoGuid,
                    module_id: moduleId,
                    title: video.title || 'Nouvelle Leçon',
                    video_url: embedUrl,
                    duration: Math.round(video.length / 60).toString() || "10",
                    order: 0,
                    content: "Contenu synchronisé automatiquement."
                }, { onConflict: 'id' });

            if (lessonError) {
                console.error(`[BUNNY_WEBHOOK] Lesson upsert error:`, lessonError);
                return NextResponse.json({ error: lessonError.message }, { status: 500 });
            }

            console.log(`[BUNNY_WEBHOOK] Successfully synced video: ${video.title}`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(`[BUNNY_WEBHOOK] Error:`, error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
