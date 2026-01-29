"use client";

import { useEffect, useRef, useState } from "react";
import { PlayCircle, AlertCircle, ExternalLink, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UnifiedPlayerProps {
    url?: string;
    poster?: string;
    className?: string;
    onEnded?: () => void;
}

/**
 * LOLLY Internal Player - Strictly handles direct video sources
 */
export function UnifiedPlayer({ url, poster, className, onEnded }: UnifiedPlayerProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        setIsLoading(true);
        setHasError(false);
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [url]);

    if (!url) {
        return (
            <div className={cn("aspect-video bg-zinc-950 rounded-[2rem] flex flex-col items-center justify-center gap-4 border border-white/5", className)}>
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                    <PlayCircle className="h-8 w-8 text-zinc-800" />
                </div>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Chargement des médias...</p>
            </div>
        );
    }

    const isEmbed = url.includes("iframe.mediadelivery.net") ||
        url.includes("youtube.com") ||
        url.includes("vimeo.com") ||
        url.includes("player.bunny.net");

    const finalUrl = url.startsWith("/videos/")
        ? encodeURI(decodeURI(url))
        : url;

    if (isEmbed) {
        return (
            <div className={cn("aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative", className)}>
                <iframe
                    src={url}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <div className={cn("aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative group", className)}>
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-20">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Initialisation du flux LOLLY</span>
                </div>
            )}

            {hasError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 gap-6 p-8 text-center z-30">
                    <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertCircle className="h-10 w-10 text-red-500/50" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-black uppercase text-sm tracking-widest">Erreur de lecture interne</p>
                        <p className="text-zinc-500 text-[10px] max-w-sm font-medium leading-relaxed">
                            Nous ne parvenons pas à lire ce fichier directement. Cela peut être dû à un format non supporté par votre navigateur ou à une restriction de sécurité locale.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" size="sm" className="rounded-xl border-white/10 text-[9px] font-black uppercase tracking-widest px-6" asChild>
                            <a href={finalUrl} target="_blank"><ExternalLink className="h-3 w-3 mr-2" /> Ouvrir en externe</a>
                        </Button>
                    </div>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    key={finalUrl}
                    src={finalUrl}
                    poster={poster}
                    controls
                    className="w-full h-full object-contain"
                    onCanPlay={() => setIsLoading(false)}
                    onEnded={onEnded}
                    onError={(e) => {
                        console.error("Internal Player Error:", e);
                        setIsLoading(false);
                        setHasError(true);
                    }}
                    preload="auto"
                    playsInline
                    controlsList="nodownload"
                >
                    <p className="text-white text-xs">Votre navigateur ne supporte pas HTML5 Video.</p>
                </video>
            )}

            {/* Premium Branding Overlay (Visible on pause/idle) */}
            <div className="absolute top-8 left-8 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">L</div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Lolly Player</span>
                </div>
            </div>

            {/* Direct Source Info for diagnostics */}
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-60 transition-opacity">
                <Badge variant="outline" className="bg-black/60 backdrop-blur-md border-white/10 text-[8px] font-bold text-white/50 py-1">
                    INTERNAL SOURCE: {finalUrl.split('/').pop()}
                </Badge>
            </div>
        </div>
    );
}
