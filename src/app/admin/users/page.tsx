"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, User, Shield, Key, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
    last_seen: string | null;
}

export default function UsersPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadUsers() {
            const supabase = createClient();

            // Try fetch profiles
            const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

            if (error) {
                // Determine if error is "relation does not exist" which means SQL wasn't run
                if (error.code === '42P01') {
                    setError("La table 'profiles' n'existe pas encore. Veuillez exécuter le script SQL de migration.");
                } else {
                    setError(error.message);
                }
            } else {
                setUsers(data || []);
            }
            setLoading(false);
        }
        loadUsers();
    }, []);

    const filteredUsers = users.filter(u =>
    (u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Utilisateurs</h1>
                    <p className="text-zinc-500 font-medium">Gérez les accès et suivez l'activité des membres.</p>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Rechercher..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 bg-zinc-900 border-white/10 text-white"
                    />
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-bold flex items-center gap-3">
                    <Shield className="h-5 w-5" />
                    {error}
                </div>
            )}

            <Card className="bg-zinc-900/50 border-white/5">
                <CardHeader className="bg-white/[0.02] border-b border-white/5 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-500">
                            Liste des membres ({users.length})
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {loading ? (
                            <div className="p-8 text-center text-zinc-500">Chargement...</div>
                        ) : filteredUsers.length === 0 && !error ? (
                            <div className="p-8 text-center text-zinc-500">Aucun utilisateur trouvé.</div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
                                            {user.full_name?.[0] || <User className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white max-w-[200px] truncate">{user.full_name || "Sans nom"}</p>
                                            <p className="text-xs text-zinc-500 font-mono">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 font-medium">
                                            <Calendar className="h-3 w-3" />
                                            {user.created_at ? format(new Date(user.created_at), 'dd MMM yyyy', { locale: fr }) : '-'}
                                        </div>

                                        <Badge variant="outline" className={`
                                            ${user.role === 'admin'
                                                ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                                : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}
                                            uppercase tracking-widest font-black text-[10px]
                                        `}>
                                            {user.role}
                                        </Badge>

                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                                            <Key className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
