"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Moon, Sun, Search, Bell, User as UserIcon, LogOut, Settings } from "lucide-react";

export function Navbar() {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        async function getInitialUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        }
        getInitialUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const userInitial = user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U";
    const userAvatar = user?.user_metadata?.avatar_url;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center font-bold text-primary-foreground text-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform">
                            L
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground hidden sm:inline-block">LOLLY</span>
                    </Link>
                </div>

                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Rechercher une formation..."
                            className="w-full bg-muted/50 border-none pl-10 h-10 rounded-full focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full w-9 h-9"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Changer de thème</span>
                    </Button>

                    {!loading && user ? (
                        <>
                            <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground rounded-full w-9 h-9">
                                <Bell className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary p-0 overflow-hidden">
                                        {userAvatar ? (
                                            <img src={userAvatar} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="font-bold text-sm">{userInitial.toUpperCase()}</span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || "Utilisateur"}</p>
                                            <p className="text-[10px] leading-none text-muted-foreground mt-1 truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className="flex items-center gap-2">Mon Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/courses" className="flex items-center gap-2">Mes Formations</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="flex items-center gap-2">Paramètres</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive flex items-center gap-2">
                                        <LogOut className="h-4 w-4" />
                                        <span>Se déconnecter</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : !loading ? (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="font-semibold px-4 hidden sm:flex">Connexion</Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-5 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)]">S'inscrire</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                    )}
                </div>
            </div>
        </nav>
    );
}
