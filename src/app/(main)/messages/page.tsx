"use client";

import { MessageSquare, Lock, ShieldAlert, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MessagesPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="h-28 w-28 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 flex items-center justify-center relative mb-8">
                <div className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full" />
                <MessageSquare className="h-12 w-12 text-primary relative z-10" />
                <div className="absolute -top-2 -right-2 h-8 w-8 bg-zinc-950 border border-white/5 rounded-2xl flex items-center justify-center">
                    <Lock className="h-4 w-4 text-primary" />
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                <h1 className="text-5xl font-black text-white tracking-tighter italic">CHUCHOTEMENTS...</h1>
                <p className="text-zinc-500 text-lg font-medium max-w-md mx-auto">
                    Le système de messagerie privée cryptée est en cours de déploiement final. Prévu pour <span className="text-white font-bold">Février 2026</span>.
                </p>
            </div>

            <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem] max-w-lg w-full relative z-10">
                <div className="flex items-start gap-6 text-left">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 mt-1">
                        <ShieldAlert className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-black text-white">Sécurité Maximale</p>
                        <p className="text-xs text-zinc-500 font-bold leading-relaxed">Vos échanges resteront 100% privés et ne seront jamais partagés ni analysés.</p>
                    </div>
                </div>
            </div>

            <Button className="h-14 px-10 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-black rounded-xl transition-all tracking-widest text-[10px]">
                ÊTRE PRÉVENU DU LANCEMENT
            </Button>
        </div>
    );
}
