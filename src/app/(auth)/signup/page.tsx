"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Mail, Lock, User, Star, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (signUpError) {
                setError(signUpError.message);
            } else {
                // Success - wait for confirmation if needed, or redirect
                alert("Compte créé avec succès ! Vérifiez votre boîte mail (ou connectez-vous si la confirmation est désactivée).");
                router.push("/login");
            }
        } catch (err) {
            setError("Une erreur inattendue est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#050505] relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/4 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-[120px]" />
            <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

            <div className="w-full max-w-md z-10 space-y-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <Link href="/" className="flex items-center gap-2 group mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center font-black text-2xl text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform">
                            L
                        </div>
                        <span className="text-3xl font-black tracking-tighter text-white">LOLLY</span>
                    </Link>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Rejoignez l'Élite</h1>
                    <p className="text-zinc-500 font-medium">Bâtissez votre empire avec les meilleurs outils.</p>
                </div>

                <Card className="border-white/5 bg-zinc-900/50 backdrop-blur-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4 text-center">
                        <div className="flex justify-center mb-4">
                            <Star className="h-8 w-8 text-primary fill-primary animate-pulse" />
                        </div>
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Nouveau Compte Premium</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 space-y-6">
                        <form onSubmit={handleSignUp} className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Nom Complet</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center text-zinc-600 group-focus-within:text-primary transition-colors">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Jean Lolly"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        className="h-14 bg-zinc-950/50 border-white/5 pl-12 rounded-2xl focus-visible:ring-primary/20 transition-all placeholder:text-zinc-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">E-mail</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center text-zinc-600 group-focus-within:text-primary transition-colors">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <Input
                                        type="email"
                                        placeholder="votre@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-14 bg-zinc-950/50 border-white/5 pl-12 rounded-2xl focus-visible:ring-primary/20 transition-all placeholder:text-zinc-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Mot de Passe</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center text-zinc-600 group-focus-within:text-primary transition-colors">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="6 caractères minimum"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="h-14 bg-zinc-950/50 border-white/5 pl-12 rounded-2xl focus-visible:ring-primary/20 transition-all placeholder:text-zinc-700"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                                    <ShieldCheck className="h-4 w-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-primary text-white hover:bg-primary/90 font-black rounded-2xl text-sm shadow-[0_20px_50px_-10px_rgba(59,130,246,0.3)] flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        CRÉATION EN COURS...
                                    </>
                                ) : (
                                    <>
                                        OBTENIR MON ACCÈS <ArrowLeft className="h-5 w-5 rotate-180" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="p-8 bg-zinc-950/20 border-t border-white/5 flex flex-col gap-4 text-center">
                        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                            Déjà membre ?
                            <Link href="/login" className="text-primary font-black hover:underline underline-offset-4">Se connecter</Link>
                        </div>
                    </CardFooter>
                </Card>

                <p className="text-center text-[9px] text-zinc-600 font-bold uppercase tracking-widest px-8">
                    En vous inscrivant, vous acceptez nos conditions générales d'utilisation et notre politique de confidentialité.
                </p>
            </div>
        </div>
    );
}
