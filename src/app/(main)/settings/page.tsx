"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, Mail, Shield, Camera, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setFullName(user.user_metadata?.full_name || "");
                setEmail(user.email || "");
            }
            setLoading(false);
        }
        loadProfile();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            if (error) throw error;
            setMessage({ type: 'success', text: "Profil mis à jour avec succès !" });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setUpdating(false);
        }
    };

    const handleResetPassword = async () => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login`,
            });
            if (error) throw error;
            setMessage({ type: 'success', text: "Un e-mail de réinitialisation a été envoyé !" });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-foreground tracking-tight">Paramètres du compte</h1>
                <p className="text-muted-foreground font-medium">Gérez vos informations personnelles et votre sécurité.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Profil public</h3>
                    <p className="text-xs text-muted-foreground">Ces informations seront visibles par les autres membres du forum.</p>
                </div>

                <Card className="md:col-span-2 border-border/40 bg-zinc-900/30 backdrop-blur-xl rounded-3xl overflow-hidden">
                    <form onSubmit={handleUpdateProfile}>
                        <CardHeader className="p-8">
                            <div className="flex items-center gap-6">
                                <div className="h-24 w-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center relative group">
                                    <User className="h-10 w-10 text-primary" />
                                    <div className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Camera className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-xl">{fullName || "Utilisateur"}</h4>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{user?.email}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <Separator className="bg-white/5" />
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nom Complet</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="h-12 bg-zinc-950/50 border-white/5 pl-12 rounded-xl focus-visible:ring-primary/20"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3 opacity-60">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Adresse E-mail (Non modifiable)</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={email}
                                        disabled
                                        className="h-12 bg-zinc-950/20 border-white/5 pl-12 rounded-xl cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-600 font-medium italic">Contactez le support pour modifier votre e-mail.</p>
                            </div>

                            {message && (
                                <div className={cn(
                                    "p-4 rounded-xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-1",
                                    message.type === 'success' ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border border-red-500/20 text-red-500"
                                )}>
                                    {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                    {message.text}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="p-8 bg-black/20 flex justify-end">
                            <Button
                                type="submit"
                                disabled={updating}
                                className="h-12 px-8 bg-primary text-white hover:bg-primary/90 font-black rounded-xl shadow-lg shadow-primary/10"
                            >
                                {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                SAUVEGARDER LES MODIFICATIONS
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>

            <Separator className="bg-white/5" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Sécurité</h3>
                    <p className="text-xs text-muted-foreground">Maintenez votre compte en sécurité avec un mot de passe robuste.</p>
                </div>

                <Card className="md:col-span-2 border-border/40 bg-zinc-900/30 backdrop-blur-xl rounded-3xl overflow-hidden p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <Shield className="h-6 w-6 text-orange-500" />
                            </div>
                            <div>
                                <p className="font-bold">Changer le mot de passe</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Sécurité du compte</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleResetPassword}
                            variant="outline"
                            className="h-10 border-white/10 hover:bg-white/5 rounded-xl font-bold"
                        >
                            RÉINITIALISER
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
