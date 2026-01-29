"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    LayoutDashboard,
    BookOpen,
    MessageSquare,
    Users,
    Award,
    Settings,
    LogOut,
    Shield
} from "lucide-react";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "Mes Formations", href: "/courses" },
    { icon: MessageSquare, label: "Messages", href: "/messages" },
    { icon: Users, label: "Forum cohorte", href: "/forum" },
    { icon: Award, label: "Certifications", href: "/certifications" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const getAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsSignedIn(!!session);

            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                setIsAdmin(profile?.role === 'admin' || session.user.email?.includes('admin') || session.user.email === 'oudama@lolly.sn'); // Fallback for dev
            }
        };
        getAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setIsSignedIn(!!session);
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                setIsAdmin(profile?.role === 'admin' || session.user.email?.includes('admin') || session.user.email === 'oudama@lolly.sn');
            } else {
                setIsAdmin(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    if (!isSignedIn) return null;

    return (
        <aside className="hidden md:flex h-[calc(100vh-64px-65px)] w-64 flex-col border-r border-border/40 bg-background/50 backdrop-blur-md">
            <div className="flex-1 overflow-y-auto py-8 px-4">
                <div className="space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 group relative",
                                pathname === item.href
                                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "h-4 w-4 transition-transform group-hover:scale-110",
                                pathname === item.href ? "text-primary-foreground" : "text-primary"
                            )} />
                            {item.label}
                            {pathname === item.href && (
                                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                            )}
                        </Link>
                    ))}

                    {/* Admin Link */}
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 group relative border border-orange-500/20 bg-orange-500/5 text-orange-500 hover:bg-orange-500/10",
                                pathname.startsWith("/admin") && "bg-orange-500 text-white shadow-lg shadow-orange-500/20 border-transparent"
                            )}
                        >
                            <Shield className={cn(
                                "h-4 w-4 transition-transform group-hover:scale-110",
                                pathname.startsWith("/admin") ? "text-white" : "text-orange-500"
                            )} />
                            ADMIN COCKPIT
                        </Link>
                    )}
                </div>
            </div>

            <div className="border-t border-border/40 p-6 space-y-2">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                    <Settings className="h-4 w-4 text-primary" />
                    Paramètres
                </Link>
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/10 transition-all"
                >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}
