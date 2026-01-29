"use client";

import { UnifiedPlayer } from "@/components/video/UnifiedPlayer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function TestPlayerPage() {
    return (
        <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center justify-center space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black tracking-tighter uppercase">Diagnostic Lecteur LOLLY</h1>
                <p className="text-zinc-500 font-medium">Test de visibilité des deux fichiers locaux détectés dans /public/videos/.</p>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/10 space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> TEST 1 : Timeline 1.mp4
                    </h2>
                    <UnifiedPlayer
                        url="/videos/Timeline 1.mp4"
                        className="rounded-2xl overflow-hidden shadow-2xl aspect-video"
                    />
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/10 space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> TEST 2 : Timeline 2.mp4
                    </h2>
                    <UnifiedPlayer
                        url="/videos/Timeline 2.mp4"
                        className="rounded-2xl overflow-hidden shadow-2xl aspect-video"
                    />
                </div>
            </div>

            <div className="flex gap-6">
                <Button asChild variant="outline" className="rounded-2xl font-black uppercase tracking-widest px-8 border-white/10">
                    <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Retour Dashboard</Link>
                </Button>
            </div>
        </div>
    );
}
