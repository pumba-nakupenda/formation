"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SetupAdminPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        async function checkUser() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        checkUser();
    }, []);

    const promoteToAdmin = async () => {
        setStatus('loading');
        const supabase = createClient();

        try {
            if (!user) {
                setStatus('error');
                setMessage("Vous devez être connecté pour effectuer cette action.");
                return;
            }

            // Update profile role
            const { error } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', user.id);

            if (error) {
                console.error("Update error:", error);
                throw new Error("Impossible de mettre à jour votre profil. Vérifiez vos permissions RLS.");
            }

            setStatus('success');
            setMessage(`Félicitations ${user.email}, vous êtes maintenant Administrateur !`);
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message || "Une erreur est survenue lors de la promotion.");
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4">
            <Link href="/" className="absolute top-8 left-8 text-zinc-500 hover:text-white flex items-center gap-2 font-bold transition-colors">
                <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
            </Link>

            <Card className="max-w-md w-full bg-zinc-900 border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
                <div className="h-2 bg-orange-600" />
                <CardHeader className="pt-10 pb-2 text-center">
                    <CardTitle className="text-3xl font-black text-white italic tracking-tighter">COCKPIT <span className="text-orange-600">RESET</span></CardTitle>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Récupération des droits admin</p>
                </CardHeader>
                <CardContent className="p-8 pt-6 space-y-8 text-center">
                    {!user ? (
                        <div className="space-y-6">
                            <p className="text-zinc-400 font-medium">
                                Vous devez être connecté pour activer votre compte Administrateur.
                            </p>
                            <Button
                                asChild
                                className="w-full bg-white text-black hover:bg-zinc-200 font-black h-14 rounded-2xl"
                            >
                                <Link href="/login">SE CONNECTER</Link>
                            </Button>
                        </div>
                    ) : status === 'idle' && (
                        <>
                            <div className="p-4 rounded-2xl bg-orange-600/5 border border-orange-600/10 text-left space-y-2">
                                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Utilisateur détecté</p>
                                <p className="text-sm font-bold text-white truncate">{user.email}</p>
                            </div>
                            <p className="text-zinc-400 font-medium text-sm leading-relaxed">
                                Suite aux mises à jour de sécurité, votre accès au cockpit nécessite le rôle spécifiquede <span className="text-white font-bold">"admin"</span>.
                            </p>
                            <Button
                                onClick={promoteToAdmin}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black h-16 rounded-2xl shadow-xl shadow-orange-600/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <ShieldCheck className="mr-2 h-5 w-5" /> ACTIVER MON ACCÈS ADMIN
                            </Button>
                        </>
                    )}

                    {status === 'loading' && (
                        <div className="flex flex-col items-center gap-6 py-8">
                            <div className="relative">
                                <Loader2 className="h-16 w-16 text-orange-600 animate-spin" />
                                <div className="absolute inset-0 bg-orange-600/20 blur-xl animate-pulse rounded-full" />
                            </div>
                            <p className="text-white font-black tracking-tight text-lg">Synchronisation des permissions...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-8 py-4">
                            <div className="flex justify-center">
                                <div className="h-24 w-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative">
                                    <ShieldCheck className="h-12 w-12 text-emerald-500" />
                                    <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-emerald-500 font-black text-xl italic tracking-tight">Accès Activé !</p>
                                <p className="text-zinc-400 text-sm font-medium">{message}</p>
                            </div>
                            <Button
                                asChild
                                className="w-full bg-white text-black hover:bg-zinc-200 font-black h-16 rounded-2xl shadow-xl"
                            >
                                <Link href="/admin">ENTRER DANS LE COCKPIT</Link>
                            </Button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-8 py-4">
                            <div className="flex justify-center">
                                <div className="h-24 w-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center relative">
                                    <AlertCircle className="h-12 w-12 text-red-500" />
                                    <div className="absolute inset-0 bg-red-500/10 blur-2xl rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-red-500 font-black text-xl italic tracking-tight">Erreur Critique</p>
                                <p className="text-zinc-400 text-sm font-medium">{message}</p>
                            </div>
                            <div className="space-y-3">
                                <Button
                                    onClick={() => setStatus('idle')}
                                    className="w-full bg-zinc-800 text-white font-black h-14 rounded-2xl border border-white/5"
                                >
                                    RÉESSAYER
                                </Button>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                    Ou utilisez la méthode SQL dans Supabase
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
