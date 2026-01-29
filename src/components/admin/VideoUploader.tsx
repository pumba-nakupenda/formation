"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadCloud, CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoUploaderProps {
    onUploadComplete: (url: string) => void;
    currentUrl?: string;
}

export function VideoUploader({ onUploadComplete, currentUrl }: VideoUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation (Max 500MB for simplicity, mp4 only)
        if (file.size > 500 * 1024 * 1024) {
            setError("Le fichier est trop volumineux (Max 500MB)");
            return;
        }
        if (file.type !== "video/mp4") {
            setError("Seul le format MP4 est accepté.");
            return;
        }

        setUploading(true);
        setError(null);
        setProgress(0);

        const supabase = createClient();
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const filePath = `uploads/${filename}`;

        try {
            const { data, error } = await supabase.storage
                .from('course-content')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('course-content')
                .getPublicUrl(filePath);

            setPreviewUrl(publicUrl);
            onUploadComplete(publicUrl);

        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "Erreur lors de l'upload");
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        onUploadComplete("");
    };

    return (
        <div className="space-y-4">
            {previewUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 group">
                    <video src={previewUrl} controls className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/60 px-2 py-1 rounded text-xs text-green-400 font-bold backdrop-blur-sm">
                        <CheckCircle2 className="h-3 w-3" /> Vidéo prête
                    </div>
                </div>
            ) : (
                <div className="border-2 border-dashed border-white/10 hover:border-primary/50 bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-xl p-8 text-center relative group cursor-pointer">
                    <input
                        type="file"
                        accept="video/mp4"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />

                    <div className="space-y-4 pointer-events-none">
                        <div className="h-12 w-12 bg-white/5 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                            {uploading ? (
                                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                            ) : (
                                <UploadCloud className="h-6 w-6 text-zinc-400 group-hover:text-primary transition-colors" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                                {uploading ? "Upload en cours..." : "Cliquez ou glissez une vidéo ici"}
                            </p>
                            <p className="text-xs text-zinc-500 font-medium">MP4 uniquement (Max 500MB)</p>
                        </div>
                    </div>

                    {error && (
                        <div className="absolute bottom-2 left-0 right-0 text-xs font-bold text-red-500">
                            {error}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
