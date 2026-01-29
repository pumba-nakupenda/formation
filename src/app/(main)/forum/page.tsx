"use client";

import { Users, MessageSquare, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ForumPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12">
            <div className="space-y-4">
                <Badge variant="outline" className="border-primary/20 text-primary font-black text-[10px] uppercase tracking-[0.4em] px-4 py-1 animate-pulse bg-primary/5">
                    Mode Cohorte
                </Badge>
                <h1 className="text-6xl font-black text-white tracking-tighter max-w-2xl">
                    L'EXPÉRIENCE <span className="text-primary italic">SOCIALE</span> ARRIVE
                </h1>
                <p className="text-zinc-500 text-xl font-medium max-w-lg mx-auto leading-relaxed">
                    Un espace réservé pour échanger avec l'élite, partager vos succès et networker avec les meilleurs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                <div className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-black text-white text-lg">Entraide Elite</h3>
                    <p className="text-xs text-zinc-500 font-bold leading-relaxed">Posez vos questions et recevez des réponses de coachs certifiés.</p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-zinc-900 border border-primary/20 space-y-4 shadow-2xl shadow-primary/10">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
                        <Users className="h-7 w-7 text-black" />
                    </div>
                    <h3 className="font-black text-white text-lg">Networking</h3>
                    <p className="text-xs text-zinc-500 font-bold leading-relaxed">Connectez-vous avec d'autres entrepreneurs de votre ville.</p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Zap className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-black text-white text-lg">Live Events</h3>
                    <p className="text-xs text-zinc-500 font-bold leading-relaxed">Accédez aux replays exclusifs des sessions de groupe.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                <Button className="h-16 px-12 bg-white text-black hover:bg-zinc-200 font-black rounded-2xl shadow-2xl flex items-center gap-3 group">
                    REJOINDRE LA LISTE D'ATTENTE
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex items-center gap-3 px-8 text-xs font-black text-zinc-600">
                    <ShieldCheck className="h-5 w-5 text-emerald-500/50" />
                    ACCÈS RÉSERVÉ AUX MEMBRES PREMIUM
                </div>
            </div>
        </div>
    );
}
