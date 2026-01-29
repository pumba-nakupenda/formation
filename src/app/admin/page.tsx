"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    BookOpen,
    TrendingUp,
    DollarSign,
    Activity,
    CreditCard,
    RefreshCcw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        courses: 0,
        modules: 0,
        lessons: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    const loadStats = async () => {
        const supabase = createClient();
        setLoading(true);

        try {
            const [
                { count: coursesCount },
                { count: modulesCount },
                { count: lessonsCount },
                { count: usersCount },
                { data: purchasesData }
            ] = await Promise.all([
                supabase.from('courses').select('*', { count: 'exact', head: true }),
                supabase.from('modules').select('*', { count: 'exact', head: true }),
                supabase.from('lessons').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('user_purchases').select('course_id').eq('status', 'completed')
            ]);

            // Calculate mock revenue or real revenue if table exists
            // Since we bypassed Stripe, we might not have many real purchases yet.
            // But let's set it up to be reactive.
            const revenue = (purchasesData || []).length * 125000; // Simplified for now

            setStats({
                users: usersCount || 0,
                courses: coursesCount || 0,
                modules: modulesCount || 0,
                lessons: lessonsCount || 0,
                revenue: revenue
            });
        } catch (err) {
            console.error("Failed to load admin stats:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const handleSync = async () => {
        try {
            setIsSyncing(true);
            const response = await fetch('/api/sync-bunny');
            const data = await response.json();

            if (data.logs) {
                console.group("📝 DÉTAILS SYNCHRONISATION");
                data.logs.forEach((log: string) => console.log(log));
                console.groupEnd();
            }

            if (response.ok) {
                alert(`${data.details}\n\nConsultez la console (F12) pour le journal détaillé.`);
                loadStats();
            } else {
                alert(`ERREUR : ${data.error || 'La synchronisation a échoué'}`);
            }
        } catch (err) {
            console.error("Sync failed:", err);
            alert("ERREUR FATALE : Impossible de contacter l'API de synchronisation.");
        } finally {
            setIsSyncing(false);
        }
    };

    const kpiCards = [
        {
            title: "Revenu Total",
            value: stats.revenue.toLocaleString(),
            currency: "FCFA",
            change: "Live",
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            title: "Membres Actifs",
            value: stats.users.toString(),
            label: "Apprenants",
            change: "+24",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Catalogue",
            value: stats.courses.toString(),
            label: "Formations",
            change: "En ligne",
            icon: BookOpen,
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            title: "Contenu Volumique",
            value: stats.lessons.toString(),
            label: "Leçons",
            change: "Total",
            icon: Activity,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ];

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tight">Vue d'ensemble</h1>
                    <p className="text-zinc-500 text-sm font-medium">Monitoring de la performance en temps réel.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="bg-primary hover:bg-primary/90 text-white font-black rounded-xl px-6 h-12 shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <RefreshCcw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'SYNCHRONISATION...' : 'SYNCHRONISER BUNNY.NET'}
                    </Button>
                    <Badge variant="outline" className="border-orange-500/20 text-orange-500 animate-pulse bg-orange-500/5 px-3 py-1 ml-2">
                        LIVE DATA
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((kpi, i) => (
                    <Card key={i} className="bg-zinc-900/50 border-white/5 shadow-xl backdrop-blur-sm hover:bg-zinc-900 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                {kpi.title}
                            </CardTitle>
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${kpi.bg}`}>
                                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-zinc-100 flex items-baseline gap-1">
                                {kpi.value}
                                {kpi.currency && <span className="text-xs font-bold text-zinc-500">{kpi.currency}</span>}
                            </div>
                            <p className="text-xs text-zinc-500 font-bold mt-1 flex items-center gap-2">
                                <span className={kpi.change.startsWith("+") ? "text-emerald-500" : "text-zinc-400"}>
                                    {kpi.change}
                                </span>
                                {kpi.label && <span className="text-zinc-600">• {kpi.label}</span>}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-zinc-900/50 border-white/5 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-zinc-300">Dernières ventes</h3>
                        <CreditCard className="h-4 w-4 text-zinc-600" />
                    </div>
                    {/* Mock list */}
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                        JL
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">Jean L.</p>
                                        <p className="text-[10px] text-zinc-500">A acheté "Business Mastery"</p>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-emerald-500">+125 000 FCFA</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="bg-zinc-900/50 border-white/5 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-zinc-300">Activité récente</h3>
                        <Activity className="h-4 w-4 text-zinc-600" />
                    </div>
                    {/* Mock activity */}
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm">
                                <div className="h-2 w-2 rounded-full bg-blue-500 translate-y-1.5" />
                                <div>
                                    <p className="text-zinc-300 font-medium">Marc D. a terminé le module <span className="text-white">Fondations</span></p>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase">Il y a 2h</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}