"use client";

import { useProgress } from "@/hooks/use-progress";
import { getCourses, type Course } from "@/lib/data/courses";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, Award, BookOpen, Loader2, Zap, ArrowRight, Star, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const { getProgress, completedLessons, loading: progressLoading } = useProgress();
    const supabase = createClient();

    const [user, setUser] = useState<any>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [purchases, setPurchases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                const [coursesData, purchasesData] = await Promise.all([
                    getCourses(),
                    user ? supabase.from('user_purchases').select('course_id').eq('user_id', user.id).eq('status', 'completed') : { data: [] }
                ]);

                setCourses(coursesData || []);
                setPurchases(purchasesData.data || []);
            } catch (err) {
                console.error("Dashboard load error:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const purchasedCourseIds = new Set(purchases.map(p => p.course_id));
    // Bypassing purchase check: show all courses as active
    const activeCourses = courses;
    const catalogCourses: Course[] = []; // Hide catalog for now since everything is active

    // Calculate total lessons across all courses for global progress
    const totalLessons = courses.reduce((acc, course) =>
        acc + (course.modules?.reduce((mAcc, m) => mAcc + (m.lessons?.length || 0), 0) || 0), 0
    );

    const globalProgress = totalLessons > 0 ? getProgress("all", totalLessons) : 0;
    const activeCoursesCount = activeCourses.length;

    if (loading || progressLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-6 bg-muted/20 rounded-3xl border border-dashed border-border/50">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-semibold">Synchronisation de vos succès...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <Zap className="h-8 w-8 text-primary fill-primary/20" />
                        Tableau de bord
                    </h1>
                    <p className="text-zinc-500 text-lg">Prêt à franchir une nouvelle étape stratégique ?</p>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-xl px-6 py-3 rounded-2xl flex items-center gap-4 border border-white/5">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black shadow-lg">
                        {completedLessons.length > 0 ? "🔥" : "🚀"}
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Série actuelle</p>
                        <p className="text-sm font-bold text-white">{completedLessons.length} leçons maîtrisées</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-primary/5 border-primary/20 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.05)] rounded-3xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Award className="h-24 w-24 text-primary" />
                    </div>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Dominance Stratégique</p>
                                <h3 className="text-4xl font-black text-white tracking-tighter">{globalProgress}%</h3>
                            </div>
                            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                                <Star className="h-7 w-7 text-white fill-white/10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-baseline justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
                                <span>Progression Master</span>
                                <span className="text-primary">{globalProgress}%</span>
                            </div>
                            <Progress value={globalProgress} className="h-3 bg-zinc-950 border border-white/5 overflow-hidden rounded-full">
                                <div className="h-full bg-primary" />
                            </Progress>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-white/5 rounded-3xl group hover:border-primary/40 transition-all duration-300">
                    <CardHeader className="p-8 pb-4">
                        <CardDescription className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-orange-500" />
                            </div>
                            Mes accès
                        </CardDescription>
                        <CardTitle className="text-4xl font-black pt-2 tracking-tighter text-white">{activeCoursesCount}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <p className="text-xs text-zinc-500 font-bold">Accès à vie débloqués.</p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-white/5 rounded-3xl group hover:border-primary/40 transition-all duration-300">
                    <CardHeader className="p-8 pb-4">
                        <CardDescription className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <Clock className="h-4 w-4 text-emerald-500" />
                            </div>
                            Leçons apprises
                        </CardDescription>
                        <CardTitle className="text-4xl font-black pt-2 tracking-tighter text-white">{completedLessons.length}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <p className="text-xs text-zinc-500 font-bold">Vers l'expertise stratégique.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-white tracking-tight">Mes Formations Actives</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">{activeCourses.length} PARCOURS</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {activeCourses.length > 0 ? (
                        activeCourses.map(course => {
                            const lessons = course.modules?.flatMap(m => m.lessons.map(l => l.id)) || [];
                            const courseProgress = getProgress(course.id, lessons.length, lessons);
                            const firstLesson = course.modules?.[0]?.lessons?.[0];

                            return (
                                <Card key={course.id} className="overflow-hidden border-white/5 bg-zinc-900/50 hover:bg-zinc-900 hover:border-primary/40 transition-all duration-300 rounded-[2rem] group/card">
                                    <div className="flex flex-col sm:flex-row items-center p-6 gap-8">
                                        <div className="h-28 w-44 bg-zinc-800 rounded-2xl flex-shrink-0 relative overflow-hidden group/thumb cursor-pointer">
                                            {course.thumbnail_url ? (
                                                <img src={course.thumbnail_url} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <BookOpen className="h-10 w-10 text-white/5" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                                <PlayCircle className="h-10 w-10 text-primary shadow-2xl" />
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-4 w-full">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-secondary uppercase tracking-widest">{course.category}</p>
                                                <h4 className="text-lg font-black text-white line-clamp-1 group-hover/card:text-primary transition-colors">{course.title}</h4>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                                                    <span>Progression</span>
                                                    <span className="text-zinc-400">{courseProgress}%</span>
                                                </div>
                                                <Progress value={courseProgress} className="h-1.5 bg-zinc-950 rounded-full overflow-hidden" />
                                            </div>
                                            {firstLesson && (
                                                <Link href={`/learn/${course.id}/${firstLesson.id}`} className="block">
                                                    <Button size="sm" className="w-full h-10 text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-white hover:bg-primary/90 mt-2 rounded-xl shadow-lg shadow-primary/5">
                                                        CONTINUER
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            )
                        })
                    ) : (
                        <div className="col-span-full py-20 bg-zinc-900/10 rounded-[2.5rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center">
                                <Search className="h-10 w-10 text-zinc-800" />
                            </div>
                            <div className="space-y-2 text-center">
                                <h3 className="text-xl font-black text-white tracking-tight">Aucun accès actif</h3>
                                <p className="text-zinc-500 font-semibold">Récupérez vos accès dans le catalogue.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {catalogCourses.length > 0 && (
                <div className="space-y-8 pt-10 border-t border-white/5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-white tracking-tight">Expand Your Knowledge</h2>
                        <Link href="/courses">
                            <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest hover:text-primary">
                                Voir Tout <ArrowRight className="ml-2 h-3 w-3" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {catalogCourses.slice(0, 3).map(course => (
                            <Card key={course.id} className="bg-zinc-900 shadow-xl border-white/5 rounded-3xl overflow-hidden group/cat">
                                <div className="aspect-video relative overflow-hidden">
                                    <img src={course.thumbnail_url} className="w-full h-full object-cover group-hover/cat:scale-110 transition-transform duration-500" alt={course.title} />
                                    <Link href={`/courses`} className="absolute inset-0 bg-black/60 opacity-0 group-hover/cat:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button className="bg-primary text-white font-black rounded-xl">DÉCOUVRIR</Button>
                                    </Link>
                                </div>
                                <div className="p-6 space-y-2">
                                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{course.category}</p>
                                    <h4 className="font-bold text-white line-clamp-1">{course.title}</h4>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
