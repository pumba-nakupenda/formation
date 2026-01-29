"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    LogOut,
    BarChart3,
    Shield
} from "lucide-react";

const adminMenuItems = [
    { icon: LayoutDashboard, label: "Vue d'ensemble", href: "/admin" },
    { icon: BookOpen, label: "Gestion des Cours", href: "/admin/courses" },
    { icon: Users, label: "Membres", href: "/admin/users" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex h-screen w-72 flex-col border-r border-white/5 bg-[#050505] text-zinc-400">
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 text-white mb-8">
                    <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center font-black shadow-lg shadow-orange-900/20">
                        <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div className="space-y-0.5">
                        <h2 className="text-lg font-black tracking-tight">COCKPIT</h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Administrateur</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Plateforme</p>
                    {adminMenuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-200 group uppercase tracking-wide",
                                pathname === item.href
                                    ? "bg-orange-600/10 text-orange-500"
                                    : "hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn(
                                "h-4 w-4 transition-transform group-hover:scale-110",
                                pathname === item.href ? "text-orange-500" : "text-zinc-600 group-hover:text-white"
                            )} />
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-white/5">
                <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                    <LogOut className="h-4 w-4" />
                    Retour au site
                </Link>
            </div>
        </aside>
    );
}
