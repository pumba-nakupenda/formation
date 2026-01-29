"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCourses, type Course } from "@/lib/data/courses";
import { useProgress } from "@/hooks/use-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Award,
    Download,
    ExternalLink,
    Loader2,
    Star,
    CheckCircle2,
    Lock,
    Trophy,
    Calendar,
    User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function CertificationsPage() {
    const { completedLessons, loading: progressLoading } = useProgress();
    const [courses, setCourses] = useState<Course[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        async function loadData() {
            const [coursesData, { data: { user } }] = await Promise.all([
                getCourses(),
                supabase.auth.getUser()
            ]);
            setCourses(coursesData);
            setUser(user);
            setLoading(false);
        }
        loadData();
    }, []);

    // Calculate completion for each course
    const courseStats = courses.map(course => {
        const lessonIds = course.modules?.flatMap(m => m.lessons.map(l => l.id)) || [];
        const totalLessons = lessonIds.length;
        const completedInThisCourse = lessonIds.filter(id => completedLessons.includes(id)).length;
        const isComplete = totalLessons > 0 && completedInThisCourse === totalLessons;
        const progress = totalLessons > 0 ? Math.round((completedInThisCourse / totalLessons) * 100) : 0;

        return {
            ...course,
            totalLessons,
            completedInThisCourse,
            isComplete,
            progress
        };
    });

    if (loading || progressLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-6 bg-muted/20 rounded-3xl border border-dashed border-border/50">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-semibold">Vérification de vos exploits...</p>
            </div>
        );
    }

    const earnedCertificates = courseStats.filter(c => c.isComplete);
    const inProgress = courseStats.filter(c => !c.isComplete && c.completedInThisCourse > 0);

    return (
        <div className="max-w-6xl mx-auto space-y-16 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-[0.3em] px-4 py-1.5">
                        <Trophy className="h-3 w-3 mr-2" /> Pavillon de l'Excellence
                    </Badge>
                    <h1 className="text-5xl font-black text-white tracking-tighter leading-none">Vos Certifications <span className="text-primary italic">LOLLY</span></h1>
                    <p className="text-zinc-500 text-lg font-medium max-w-2xl">
                        Vos accomplissements sont le reflet de votre détermination. Retrouvez ici vos diplômes officiels et vos parcours en cours.
                    </p>
                </div>
                <div className="h-24 w-24 rounded-3xl bg-zinc-950 border border-white/5 flex flex-col items-center justify-center p-4 shadow-2xl">
                    <span className="text-3xl font-black text-primary leading-none">{earnedCertificates.length}</span>
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-2">DIPLÔMES</span>
                </div>
            </div>

            {/* Earned Certificates grid */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-600">Certificats Obtenus</h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                {earnedCertificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {earnedCertificates.map(cert => (
                            <Card key={cert.id} className="bg-zinc-950 border-primary/20 rounded-[2.5rem] overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
                                <div className="p-8 space-y-8">
                                    <div className="flex items-start justify-between">
                                        <div className="h-20 w-20 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner shadow-primary/5">
                                            <Award className="h-10 w-10 text-primary" />
                                        </div>
                                        <Badge variant="outline" className="border-primary/30 text-primary font-black text-[9px] uppercase tracking-widest py-1 px-3">OFFICIEL</Badge>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black text-white leading-tight tracking-tight group-hover:text-primary transition-colors">{cert.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                            <span className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-primary" /> {user?.user_metadata?.full_name || "Étudiant VIP"}</span>
                                            <span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-primary" /> {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                        <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5 font-black text-[10px] uppercase tracking-widest px-6 h-12">
                                            <Download className="h-4 w-4 mr-2" /> Télécharger PDF
                                        </Button>
                                        <Button className="rounded-xl bg-primary text-black hover:bg-primary/90 font-black text-[10px] uppercase tracking-widest px-6 h-12 shadow-xl shadow-primary/10">
                                            <ExternalLink className="h-4 w-4 mr-2" /> Partager
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] text-center space-y-6">
                        <Award className="h-16 w-16 text-zinc-800 mx-auto" />
                        <div className="space-y-2">
                            <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">Aucun diplôme pour le moment</p>
                            <p className="text-zinc-700 text-sm max-w-xs mx-auto">Terminez votre première formation à 100% pour débloquer votre certificat officiel.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* In Progress grid */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-600">Parcours en cours</h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {inProgress.map(course => (
                        <Card key={course.id} className="bg-zinc-950/50 border-white/5 rounded-[2rem] overflow-hidden group hover:border-white/10 transition-all">
                            <div className="p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{course.category}</span>
                                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <Loader2 className="h-4 w-4 text-zinc-700" />
                                    </div>
                                </div>

                                <h4 className="font-black text-white leading-tight tracking-tight line-clamp-1">{course.title}</h4>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-600">
                                        <span>Completion</span>
                                        <span className="text-white">{course.progress}%</span>
                                    </div>
                                    <Progress value={course.progress} className="h-1.5 bg-zinc-900 border-none rounded-full" />
                                </div>

                                <Button asChild variant="ghost" className="w-full justify-between h-12 rounded-xl text-zinc-600 group-hover:text-primary group-hover:bg-primary/5 font-black text-[9px] uppercase tracking-widest px-4 border border-transparent hover:border-primary/20">
                                    <span>Terminer pour débloquer</span>
                                    <Lock className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {/* Add a placeholder if empty */}
                    {inProgress.length === 0 && (
                        <Card className="md:col-span-3 bg-white/[0.01] border-dashed border-white/5 rounded-[2rem] p-10 text-center">
                            <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.3em]">Commencez une formation pour voir votre progression ici</p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Premium CTA */}
            <div className="p-12 bg-gradient-to-r from-primary/10 via-zinc-950 to-secondary/5 border border-primary/20 rounded-[3rem] text-center space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-64 w-64 bg-primary/20 blur-[100px] pointer-events-none" />
                <h3 className="text-3xl font-black text-white tracking-tighter relative z-10">L'Excellence n'attend pas</h3>
                <p className="text-zinc-500 font-medium max-w-xl mx-auto relative z-10">
                    Chaque certificat LOLLY est une preuve de votre expertise sur le marché. Continuez à apprendre, continuez à grandir.
                </p>
                <div className="pt-4 relative z-10">
                    <Button className="h-14 px-10 rounded-2xl bg-primary text-black hover:bg-primary/90 font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20">
                        Retour au Catalogue
                    </Button>
                </div>
            </div>
        </div>
    );
}
