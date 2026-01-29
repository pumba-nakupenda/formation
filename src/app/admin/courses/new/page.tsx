"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    GripVertical,
    Video,
    Clock,
    LayoutList,
    Image as ImageIcon,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { VideoUploader } from "@/components/admin/VideoUploader";

// Types for local state management before saving
interface LessonDraft {
    id: string; // temp id
    title: string;
    duration: string;
    video_url: string;
}

interface ModuleDraft {
    id: string; // temp id
    title: string;
    lessons: LessonDraft[];
}

export default function NewCoursePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    // Course Details State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Business");
    const [price, setPrice] = useState("0");
    const [thumbnail, setThumbnail] = useState("");

    // Curriculum State
    const [modules, setModules] = useState<ModuleDraft[]>([
        { id: 'mod-1', title: 'Module 1 : Introduction', lessons: [] }
    ]);

    const handleAddModule = () => {
        setModules([
            ...modules,
            { id: `mod-${Date.now()}`, title: `Nouveau Module ${modules.length + 1}`, lessons: [] }
        ]);
    };

    const handleAddLesson = (moduleId: string) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    lessons: [
                        ...m.lessons,
                        { id: `les-${Date.now()}`, title: 'Nouvelle Leçon', duration: '10:00', video_url: '' }
                    ]
                };
            }
            return m;
        }));
    };

    const handleSaveCourse = async () => {
        setSaving(true);
        const supabase = createClient();

        try {
            // 1. Create Course
            const { data: course, error: courseError } = await supabase.from('courses').insert({
                title,
                description,
                category,
                price_fcfa: parseInt(price) || 0,
                thumbnail_url: thumbnail,
                rating: 5.0, // Default for new courses
                instructor_name: "Admin" // Default
            }).select().single();

            if (courseError) throw courseError;

            // 2. Create Modules & Lessons
            for (let i = 0; i < modules.length; i++) {
                const m = modules[i];
                const { data: moduleData, error: moduleError } = await supabase.from('modules').insert({
                    course_id: course.id,
                    title: m.title,
                    order: i + 1
                }).select().single();

                if (moduleError) throw moduleError;

                if (m.lessons.length > 0) {
                    const lessonsToInsert = m.lessons.map((l, index) => ({
                        module_id: moduleData.id,
                        title: l.title,
                        duration: l.duration,
                        video_url: l.video_url,
                        order: index + 1,
                        content: "" // Empty content for now
                    }));

                    const { error: lessonError } = await supabase.from('lessons').insert(lessonsToInsert);
                    if (lessonError) throw lessonError;
                }
            }

            // Success!
            router.push('/admin/courses');
            router.refresh();

        } catch (error) {
            console.error("Error creating course:", error);
            alert("Erreur lors de la création. Vérifiez la console.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl py-4 border-b border-white/5 -mx-8 px-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white/10 text-zinc-400">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight">Nouveau Cours</h1>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Brouillon</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 font-bold">
                        Annuler
                    </Button>
                    <Button onClick={handleSaveCourse} disabled={saving} className="bg-orange-600 hover:bg-orange-700 text-white font-bold min-w-[140px]">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Publier
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Curriculum & Basic Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info Card */}
                    <Card className="bg-zinc-900/50 border-white/5 overflow-hidden">
                        <CardHeader className="bg-white/[0.02] border-b border-white/5 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                <LayoutList className="h-4 w-4" /> Informations Générales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-zinc-400 font-bold text-xs uppercase">Titre du cours</Label>
                                <Input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="bg-zinc-950 border-white/10 h-14 text-lg font-bold text-white placeholder:text-zinc-700"
                                    placeholder="Ex: Masterclass Vente 2024"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-zinc-400 font-bold text-xs uppercase">Description courte</Label>
                                <Textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="bg-zinc-950 border-white/10 min-h-[100px] text-zinc-300 placeholder:text-zinc-700 resize-none"
                                    placeholder="Une phrase d'accroche percutante..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Curriculum Builder */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-black text-white">Programme</h3>
                            <Button onClick={handleAddModule} size="sm" variant="outline" className="border-white/10 text-zinc-400 hover:text-white h-9 px-4 text-xs font-bold uppercase tracking-widest">
                                <Plus className="h-3 w-3 mr-2" /> Ajouter un module
                            </Button>
                        </div>

                        {modules.map((module, mIndex) => (
                            <Card key={module.id} className="bg-zinc-900 border-white/5 overflow-hidden group">
                                <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center gap-4">
                                    <GripVertical className="h-5 w-5 text-zinc-700 cursor-move" />
                                    <div className="flex-1">
                                        <Input
                                            value={module.title}
                                            onChange={e => {
                                                const newModules = [...modules];
                                                newModules[mIndex].title = e.target.value;
                                                setModules(newModules);
                                            }}
                                            className="bg-transparent border-none h-auto p-0 text-sm font-black text-zinc-200 placeholder:text-zinc-700 focus-visible:ring-0"
                                            placeholder="Titre du module"
                                        />
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="p-2 space-y-2 bg-zinc-950/30">
                                    {module.lessons.map((lesson, lIndex) => (
                                        <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-white/5 hover:border-white/10 transition-colors group/lesson">
                                            <div className="h-6 w-6 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                                                {lIndex + 1}
                                            </div>
                                            <div className="flex-1 grid grid-cols-12 gap-4">
                                                <Input
                                                    value={lesson.title}
                                                    onChange={e => {
                                                        const newModules = [...modules];
                                                        newModules[mIndex].lessons[lIndex].title = e.target.value;
                                                        setModules(newModules);
                                                    }}
                                                    className="col-span-5 h-8 bg-zinc-950 border-white/5 text-xs font-medium focus-visible:ring-0 focus:border-orange-500/50"
                                                    placeholder="Titre de la leçon"
                                                />
                                                <div className="col-span-5 relative">
                                                    <VideoUploader
                                                        currentUrl={lesson.video_url}
                                                        onUploadComplete={(url) => {
                                                            const newModules = [...modules];
                                                            newModules[mIndex].lessons[lIndex].video_url = url;
                                                            setModules(newModules);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-span-2 relative">
                                                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-600" />
                                                    <Input
                                                        value={lesson.duration}
                                                        onChange={e => {
                                                            const newModules = [...modules];
                                                            newModules[mIndex].lessons[lIndex].duration = e.target.value;
                                                            setModules(newModules);
                                                        }}
                                                        className="h-8 pl-8 bg-zinc-950 border-white/5 text-xs text-zinc-400 focus-visible:ring-0 focus:border-orange-500/50"
                                                        placeholder="10:00"
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => {
                                                    const newModules = [...modules];
                                                    newModules[mIndex].lessons = newModules[mIndex].lessons.filter((_, i) => i !== lIndex);
                                                    setModules(newModules);
                                                }}
                                                className="h-8 w-8 text-zinc-700 hover:text-red-500 opacity-0 group-hover/lesson:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleAddLesson(module.id)}
                                        className="w-full h-10 border border-dashed border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 text-xs font-bold uppercase tracking-wider rounded-xl"
                                    >
                                        <Plus className="h-3 w-3 mr-2" /> Ajouter une leçon
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Settings */}
                <div className="space-y-6">
                    <Card className="bg-zinc-900/50 border-white/5">
                        <CardHeader className="bg-white/[0.02] border-b border-white/5 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-500">Paramètres</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-zinc-400 font-bold text-xs uppercase">Catégorie</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Business", "Design", "Tech", "Marketing"].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategory(cat)}
                                            className={`h-10 text-xs font-bold rounded-lg border transition-all ${category === cat
                                                ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-900/20'
                                                : 'bg-zinc-950 border-white/5 text-zinc-500 hover:text-white hover:border-white/10'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="space-y-3">
                                <Label className="text-zinc-400 font-bold text-xs uppercase">Prix (FCFA)</Label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        className="bg-zinc-950 border-white/10 pl-4 pr-12 font-mono text-white"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-bold">FCFA</span>
                                </div>
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="space-y-3">
                                <Label className="text-zinc-400 font-bold text-xs uppercase">Image de couverture</Label>
                                <div className="aspect-video rounded-xl bg-zinc-950 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-zinc-600 gap-2 overflow-hidden relative group">
                                    {thumbnail ? (
                                        <>
                                            <img src={thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => setThumbnail("")}
                                                className="absolute bottom-2 right-2 h-8 w-8 p-0 rounded-full"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon className="h-8 w-8 opacity-50" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Coller URL ci-dessous</span>
                                        </>
                                    )}
                                </div>
                                <Input
                                    value={thumbnail}
                                    onChange={e => setThumbnail(e.target.value)}
                                    placeholder="https://..."
                                    className="bg-zinc-950 border-white/10 text-xs text-zinc-400"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
