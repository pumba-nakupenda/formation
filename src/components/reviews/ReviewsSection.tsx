"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    user_id: string;
}

export function ReviewsSection({ courseId }: { courseId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [userReview, setUserReview] = useState<Review | null>(null); // Existing review if any
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [canReview, setCanReview] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        async function load() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            // 1. Get all reviews
            const { data: allReviews } = await supabase
                .from('reviews')
                .select('*')
                .eq('course_id', courseId)
                .order('created_at', { ascending: false });

            if (allReviews) setReviews(allReviews);

            if (user) {
                // 2. Check if user already reviewed
                const myReview = allReviews?.find(r => r.user_id === user.id);
                if (myReview) setUserReview(myReview);

                // 3. Check if user can review (e.g. bought the course or started it)
                // For now, simplify: if logged in, can review.
                // Ideally check user_progress > 0 or entitlements
                setCanReview(true);
            }
            setLoading(false);
        }
        load();
    }, [courseId]);

    const handleSubmit = async () => {
        setSubmitting(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('reviews').insert({
            course_id: courseId,
            user_id: user.id,
            rating,
            comment
        });

        if (!error) {
            // Reload simple
            const { data: allReviews } = await supabase
                .from('reviews')
                .select('*')
                .eq('course_id', courseId)
                .order('created_at', { ascending: false });
            if (allReviews) setReviews(allReviews);
            setUserReview({
                id: 'temp',
                rating,
                comment,
                created_at: new Date().toISOString(),
                user_id: user.id
            });
        }
        setSubmitting(false);
    };

    if (loading) return <div className="py-10 text-center text-zinc-500">Chargement des avis...</div>;

    return (
        <div className="space-y-8 mt-12 border-t border-white/5 pt-12">
            <h2 className="text-2xl font-black text-white tracking-tight">Avis des membres ({reviews.length})</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Review Form */}
                <div className="lg:col-span-1">
                    {userReview ? (
                        <Card className="bg-emerald-900/10 border-emerald-500/20">
                            <CardContent className="p-6 space-y-3 text-center">
                                <div className="h-12 w-12 bg-emerald-500/20 text-emerald-500 rounded-full mx-auto flex items-center justify-center">
                                    <Star className="h-6 w-6 fill-current" />
                                </div>
                                <h3 className="font-bold text-emerald-400">Merci pour votre avis !</h3>
                                <p className="text-sm text-zinc-400">Votre retour aide la communauté.</p>
                            </CardContent>
                        </Card>
                    ) : canReview ? (
                        <Card className="bg-zinc-900/50 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase text-zinc-500 tracking-widest">Notez ce programme</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-8 w-8 ${star <= rating ? 'fill-orange-500 text-orange-500' : 'text-zinc-700'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <Textarea
                                    placeholder="Qu'avez-vous pensé de cette formation ?"
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    className="bg-zinc-950 border-white/10 text-white min-h-[100px]"
                                />
                                <Button
                                    onClick={handleSubmit}
                                    disabled={submitting || !comment}
                                    className="w-full bg-white text-black hover:bg-zinc-200 font-bold"
                                >
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publier l'avis"}
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-zinc-900/30 border-white/5 p-6 text-center">
                            <p className="text-zinc-500 text-sm">Connectez-vous pour laisser un avis.</p>
                        </Card>
                    )}
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="pb-6 border-b border-white/5 last:border-0 hover:bg-white/[0.02] p-4 rounded-xl transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                    <User className="h-5 w-5 text-zinc-500" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-white">Membre Lolly</span>
                                            <span className="text-xs text-zinc-600 font-medium">• {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: fr })}</span>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3 w-3 ${i < review.rating ? 'fill-orange-500 text-orange-500' : 'text-zinc-800'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{review.comment}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {reviews.length === 0 && (
                        <div className="text-center py-12 bg-white/[0.02] rounded-2xl border border-dashed border-white/5">
                            <p className="text-zinc-500 font-medium">Aucun avis pour l'instant.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
