"use client";

import { useEffect, useState } from "react";
import { getCourses, type Course } from "@/lib/data/courses";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star, Clock, BookOpen, ArrowRight, Loader2, CreditCard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tous");

    const handleBuy = async (course: Course) => {
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: course.id,
                    title: course.title,
                })
            });
            const { url } = await response.json();
            if (url) window.location.href = url;
        } catch (err) {
            console.error("Checkout failed:", err);
        }
    };

    const [user, setUser] = useState<any>(null);
    const [purchases, setPurchases] = useState<any[]>([]);

    useEffect(() => {
        async function loadCourses() {
            setLoading(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            const [coursesData, purchasesData] = await Promise.all([
                getCourses(),
                user ? supabase.from('user_purchases').select('course_id').eq('user_id', user.id).eq('status', 'completed') : { data: [] }
            ]);

            setCourses(coursesData);
            setPurchases(purchasesData.data || []);
            setLoading(false);
        }
        loadCourses();
    }, []);

    const purchasedCourseIds = new Set(purchases.map(p => p.course_id));

    const categories = ["Tous", ...Array.from(new Set(courses.map(c => c.category)))];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "Tous" || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-3">
                    <Badge variant="outline" className="border-primary/20 text-primary font-black text-[9px] uppercase tracking-[0.3em] px-3">Catalogue</Badge>
                    <h1 className="text-5xl font-black text-white tracking-tighter">Nos <span className="text-primary italic">Formations</span></h1>
                    <p className="text-zinc-500 text-lg font-medium">Découvrez des parcours conçus pour propulser votre excellence.</p>
                </div>
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Rechercher..."
                        className="pl-12 h-14 bg-white/[0.03] border-white/5 rounded-2xl focus:ring-primary/20 focus:border-primary/40 text-white font-bold transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                            selectedCategory === cat
                                ? "bg-primary text-black shadow-lg shadow-primary/20 scale-105"
                                : "bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white border border-white/5"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6 bg-muted/20 rounded-3xl border border-dashed border-border/50">
                    <div className="relative">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
                    </div>
                    <p className="text-muted-foreground font-semibold text-lg">Chargement de l'univers LOLLY...</p>
                </div>
            ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="group overflow-hidden border-border/40 bg-card hover:border-primary/40 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.05)] rounded-3xl">
                            <div className="aspect-[16/10] bg-zinc-900 relative overflow-hidden">
                                {course.thumbnail_url ? (
                                    <img
                                        src={course.thumbnail_url}
                                        alt={course.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <BookOpen className="h-16 w-16 text-muted-foreground/20 group-hover:text-primary/20 transition-colors" />
                                    </div>
                                )}
                                <div className="absolute top-6 left-6 z-10 glass px-4 py-2 rounded-2xl text-[10px] font-black text-white flex items-center gap-2 shadow-2xl uppercase tracking-widest bg-black/60">
                                    <Star className="h-3 w-3 fill-primary text-primary" /> {course.rating}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-0 opacity-60" />
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">{course.category}</span>
                                    <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{course.title}</CardTitle>
                                </div>

                                <div className="flex items-center gap-6 text-xs text-muted-foreground font-bold">
                                    <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> {course.modules?.length || 0} modules</span>
                                    <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {course.duration}</span>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Investissement</p>
                                        <p className="text-xl font-black text-white tracking-tight">
                                            {course.price_fcfa > 0 ? (
                                                <>{course.price_fcfa.toLocaleString()} <span className="text-xs font-bold text-muted-foreground">FCFA</span></>
                                            ) : (
                                                <span className="text-primary">FREE</span>
                                            )}
                                        </p>
                                    </div>
                                    {course.modules?.[0]?.lessons?.[0]?.id ? (
                                        <Link href={`/learn/${course.id}/${course.modules[0].lessons[0].id}`}>
                                            <Button size="sm" className="bg-white/5 text-white hover:bg-white/10 font-black rounded-xl px-5 h-10 border border-white/5">
                                                ACCÉDER <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button disabled size="sm" className="bg-white/5 text-zinc-600 font-black rounded-xl px-5 h-10 border border-white/5 cursor-not-allowed">
                                            BIENTÔT <Clock className="ml-2 h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-muted/10 rounded-3xl border-2 border-dashed border-border/40">
                    <Search className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg font-bold">Aucune formation ne correspond à votre recherche.</p>
                    <Button variant="link" onClick={() => setSearchQuery("")} className="text-primary mt-2">Réinitialiser les filtres</Button>
                </div>
            )}
        </div>
    );
}
