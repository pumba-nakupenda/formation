"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, MessageSquare, Star, DollarSign, Activity, ArrowUpRight } from "lucide-react";

export default function AnalyticsPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalReviews: 0,
        avgRating: 0,
        totalPosts: 0,
        activeThisWeek: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            const supabase = createClient();

            // Parallel fetching
            const [
                { count: userCount },
                { data: reviews },
                { count: postCount }
            ] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('reviews').select('rating'),
                supabase.from('forum_posts').select('*', { count: 'exact', head: true })
            ]);

            // Calculate Avg Rating
            const totalRating = reviews?.reduce((acc, curr) => acc + curr.rating, 0) || 0;
            const avgRating = reviews?.length ? (totalRating / reviews.length).toFixed(1) : "0.0";

            setStats({
                totalUsers: userCount || 0,
                totalReviews: reviews?.length || 0,
                avgRating: Number(avgRating),
                totalPosts: postCount || 0,
                activeThisWeek: Math.floor((userCount || 0) * 0.8) // Mock activity for now
            });
            setLoading(false);
        }
        loadStats();
    }, []);

    const cards = [
        {
            title: "Revenus (Estimé)",
            value: "2,450,000",
            suffix: "FCFA",
            icon: DollarSign,
            change: "+12%",
            trend: "up",
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "Membres Actifs",
            value: stats.totalUsers.toString(),
            suffix: "",
            icon: Users,
            change: "+5",
            trend: "up",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Note Moyenne",
            value: stats.avgRating.toString(),
            suffix: "/ 5",
            icon: Star,
            change: `${stats.totalReviews} avis`,
            trend: "neutral",
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            title: "Interaction Communauté",
            value: stats.totalPosts.toString(),
            suffix: "posts",
            icon: MessageSquare,
            change: "Actif",
            trend: "up",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Analytics</h1>
                    <p className="text-zinc-500 font-medium">Performance de la plateforme en temps réel.</p>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 rounded-lg px-3 py-1.5">
                    <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Live</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <Card key={i} className="bg-zinc-900/50 border-white/5 overflow-hidden group hover:border-white/10 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">
                                {card.title}
                            </CardTitle>
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${card.bg}`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-white">
                                {loading ? "-" : card.value}
                                <span className="text-xs font-bold text-zinc-500 ml-1">{card.suffix}</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1 font-medium">
                                <span className={card.change.includes('+') ? "text-green-500" : "text-zinc-500"}>
                                    {card.change}
                                </span>
                                {card.change.includes('+') && <ArrowUpRight className="h-3 w-3 text-green-500" />}
                                <span className="text-zinc-600">vs mois dernier</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section (Visual Mockup for Premium Feel) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="col-span-2 bg-zinc-900/50 border-white/5 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">Croissance des Inscriptions</h3>
                    </div>
                    <div className="h-[300px] w-full bg-gradient-to-t from-primary/5 via-transparent to-transparent rounded-xl border-b border-white/5 relative flex items-end justify-between px-4 pb-0 overflow-hidden">
                        {/* Mock Bars */}
                        {[30, 45, 32, 60, 75, 50, 85, 90, 80, 100, 110, 125].map((h, i) => (
                            <div key={i} className="w-full mx-1 bg-primary/20 hover:bg-primary/50 transition-all rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="bg-zinc-900/50 border-white/5 p-6 space-y-6">
                    <h3 className="text-lg font-bold text-white">Top Formations</h3>
                    <div className="space-y-4">
                        {[
                            { name: "Masterclass Vente", sales: 120, trend: "+12%" },
                            { name: "Marketing Digital", sales: 85, trend: "+5%" },
                            { name: "Crypto Trading", sales: 64, trend: "+8%" },
                        ].map((course, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div>
                                    <p className="text-sm font-bold text-white">{course.name}</p>
                                    <p className="text-xs text-zinc-500">{course.sales} ventes</p>
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">
                                    {course.trend}
                                </span>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full border-white/10 text-zinc-400 hover:text-white hover:bg-white/5">
                        Voir tout
                    </Button>
                </Card>
            </div>
        </div>
    );
}
