"use client";

import { getCourseById, type Course, type Lesson } from "@/lib/data/courses";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    CheckCircle2,
    ChevronRight,
    Menu,
    Loader2,
    Clock,
    AlertCircle,
    ArrowLeft,
    PlayCircle,
    ShieldCheck,
    Lock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/use-progress";
import { UnifiedPlayer } from "@/components/video/UnifiedPlayer";

export default function LearnPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const courseId = params.courseId as string;
    const lessonId = params.lessonId as string;
    const { completeLesson, isLessonCompleted } = useProgress();

    const [user, setUser] = useState<any>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                // Check auth
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                // Load course
                const data = await getCourseById(courseId);
                setCourse(data);

                if (data && data.modules) {
                    let foundLesson = null;
                    for (const module of data.modules) {
                        const l = module.lessons.find(l => l.id === lessonId);
                        if (l) {
                            foundLesson = l;
                            break;
                        }
                    }
                    setCurrentLesson(foundLesson);
                }
            } catch (err) {
                console.error("Failed to load lesson:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [courseId, lessonId]);

    const handleVideoEnded = () => {
        if (currentLesson && !isLessonCompleted(currentLesson.id)) {
            completeLesson(currentLesson.id, courseId);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
                <div className="h-12 w-12 border-t-2 border-primary rounded-full animate-spin" />
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">LOLLY ACADEMY</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-[#050505] p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full translate-y-1/2" />
                <ShieldCheck className="h-24 w-24 text-primary animate-pulse relative z-10" />
                <div className="space-y-4 relative z-10">
                    <h2 className="text-5xl font-black tracking-tighter uppercase text-white">ACCÈS RÉSERVÉ</h2>
                    <p className="text-zinc-500 text-lg font-medium max-w-md">Connectez-vous pour débloquer votre potentiel et accéder aux stratégies exclusives.</p>
                </div>
                <Link href="/login" className="relative z-10">
                    <Button className="bg-primary hover:bg-primary/90 text-white px-10 rounded-2xl h-16 font-black shadow-2xl shadow-primary/20 text-sm tracking-widest">DÉVERROUILLER MAINTENANT</Button>
                </Link>
            </div>
        );
    }

    if (!course || !currentLesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-background p-8 text-center">
                <AlertCircle className="h-20 w-20 text-red-500/20" />
                <h2 className="text-3xl font-black tracking-tighter">ÉCHEC DE SYNCHRONISATION</h2>
                <Button onClick={() => router.push('/dashboard')} className="bg-primary px-10 rounded-2xl h-14 font-black shadow-2xl shadow-primary/20">RETOUR DASHBOARD</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            {/* Strategy Header */}
            <header className="h-16 border-b border-white/5 bg-zinc-950/80 backdrop-blur-3xl flex items-center justify-between px-6 z-50 shrink-0">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-xl group/back">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <Separator orientation="vertical" className="h-6 bg-white/10" />
                    <div className="flex flex-col font-bold">
                        <span className="text-[9px] font-black text-primary/70 uppercase tracking-[0.3em] leading-none mb-1">{course.title}</span>
                        <h1 className="text-[13px] font-black text-white tracking-tight truncate max-w-[200px] md:max-w-none">{currentLesson.title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="hidden lg:flex border-emerald-500/30 text-emerald-500 font-black text-[9px] uppercase tracking-widest bg-emerald-500/5 px-3">PROTECTION TRANSACTIONNELLE ACTIVE</Badge>
                    <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 overflow-y-auto bg-black p-4 md:p-8 lg:p-12 space-y-12 custom-scrollbar pb-40">
                    <div className="max-w-5xl mx-auto w-full space-y-12">
                        <UnifiedPlayer
                            url={currentLesson.video_url}
                            poster={course.thumbnail_url}
                            onEnded={handleVideoEnded}
                            className="ring-1 ring-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,1)]"
                        />

                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
                            <div className="space-y-6 flex-1">
                                <div className="space-y-3">
                                    <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">{currentLesson.title}</h1>
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                        <span className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full"><Clock className="h-3.5 w-3.5" /> {currentLesson.duration} MINS</span>
                                        <span className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-white/5">FULL HD</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 min-w-[280px]">
                                <Button
                                    onClick={() => completeLesson(lessonId, courseId)}
                                    size="lg"
                                    className={cn(
                                        "h-20 px-10 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_30px_60px_-15px_rgba(59,130,246,0.3)] active:scale-95",
                                        isLessonCompleted(lessonId)
                                            ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20"
                                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                                    )}
                                >
                                    {isLessonCompleted(lessonId) ? (
                                        <><CheckCircle2 className="mr-3 h-5 w-5" /> MODULE TERMINÉ</>
                                    ) : (
                                        "VALIDER LA LEÇON"
                                    )}
                                </Button>
                            </div>
                        </div>

                        <Separator className="bg-white/5" />

                        <div className="p-10 bg-zinc-900/30 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 h-40 w-40 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/10 transition-all duration-700" />
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-4">
                                <div className="h-1 w-8 bg-primary rounded-full" /> Notes Stratégiques
                            </h3>
                            <div className="prose prose-invert prose-lg max-w-none">
                                <p className="text-zinc-400 text-lg leading-relaxed font-medium italic border-l-2 border-white/10 pl-6">
                                    {currentLesson.content || "Le contenu textuel pour cette leçon premium est en cours de préparation."}
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                <aside className={cn(
                    "w-96 border-l border-white/5 bg-zinc-950 flex flex-col transition-all duration-700",
                    !sidebarOpen ? "hidden md:flex md:w-0 overflow-hidden border-l-0 opacity-0" : "flex opacity-100"
                )}>
                    <div className="p-10 border-b border-white/5 bg-zinc-950/50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-foreground text-[10px] uppercase tracking-[0.4em]">Progression</h3>
                            <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black">ACTIF</Badge>
                        </div>
                        <div className="space-y-3">
                            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                <div className="h-full bg-primary shadow-[0_0_15px_rgba(59,130,246,0.6)]" style={{ width: '0%' }} />
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 custom-scrollbar">
                        <div className="p-0">
                            {course.modules?.map((module, mIdx) => (
                                <div key={module.id} className="border-b border-white/5 last:border-0">
                                    <div className="px-10 py-6 bg-white/[0.03]">
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em]">M{mIdx + 1} • {module.title}</span>
                                    </div>
                                    <div className="p-0">
                                        {module.lessons.map((lesson, lIdx) => (
                                            <Link
                                                key={lesson.id}
                                                href={`/learn/${course.id}/${lesson.id}`}
                                                className={cn(
                                                    "flex items-center gap-6 px-10 py-7 transition-all relative group overflow-hidden",
                                                    lesson.id === lessonId
                                                        ? "bg-primary/5 after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-primary shadow-inner shadow-black"
                                                        : "hover:bg-white/[0.04]"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-12 w-12 rounded-[1.2rem] border-2 flex items-center justify-center flex-shrink-0 transition-all duration-500",
                                                    lesson.id === lessonId ? "bg-primary border-primary text-white shadow-xl shadow-primary/30 rotate-3 scale-110" :
                                                        isLessonCompleted(lesson.id) ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" :
                                                            "border-white/5 bg-zinc-900 group-hover:border-primary/40 group-hover:scale-105"
                                                )}>
                                                    {isLessonCompleted(lesson.id) ? <CheckCircle2 className="h-5 w-5" /> :
                                                        lesson.id === lessonId ? <PlayCircle className="h-5 w-5" /> :
                                                            <span className="text-[10px] font-black text-zinc-700 group-hover:text-zinc-500">{lIdx + 1}</span>}
                                                </div>
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <p className={cn(
                                                        "text-[15px] font-black tracking-tight truncate transition-colors",
                                                        lesson.id === lessonId ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                                                    )}>
                                                        {lesson.title}
                                                    </p>
                                                    <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">{lesson.duration} Mins</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </aside>
            </div>
        </div>
    );
}
