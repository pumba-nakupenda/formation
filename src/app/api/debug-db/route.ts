import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = createClient();

    const { data: courses } = await supabase.from('courses').select('*, modules (*, lessons (*))');

    return NextResponse.json({
        count: courses?.length || 0,
        courses: courses
    });
}
