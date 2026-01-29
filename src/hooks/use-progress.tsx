"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ProgressContextType {
    completedLessons: string[];
    completeLesson: (lessonId: string, courseId?: string) => Promise<void>;
    isLessonCompleted: (lessonId: string) => boolean;
    getProgress: (courseId: string, totalLessons: number, lessonIds?: string[]) => number;
    loading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Initial Load & Auth Listen
    useEffect(() => {
        const getInitialAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                loadRemoteProgress(session.user.id);
            } else {
                setLoading(false);
            }
        };
        getInitialAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const newUser = session?.user ?? null;
            setUser(newUser);
            if (newUser) {
                loadRemoteProgress(newUser.id);
            } else {
                setCompletedLessons([]);
                setLoading(false);
            }
        });

        // Load from LocalStorage first for instant UI (anonymous or before auth loads)
        const savedProgress = localStorage.getItem("lolly_progress");
        if (savedProgress) {
            setCompletedLessons(JSON.parse(savedProgress));
        }

        return () => subscription.unsubscribe();
    }, []);

    const loadRemoteProgress = async (userId: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('user_progress')
                .select('lesson_id')
                .eq('user_id', userId)
                .eq('completed', true);

            if (data && !error) {
                const remoteIds = data.map((p: any) => p.lesson_id);
                setCompletedLessons(prev => {
                    const merged = Array.from(new Set([...prev, ...remoteIds]));
                    localStorage.setItem("lolly_progress", JSON.stringify(merged));
                    return merged;
                });
            }
        } catch (e) {
            console.error("Error loading progress:", e);
        } finally {
            setLoading(false);
        }
    };

    const completeLesson = async (lessonId: string, courseId?: string) => {
        // 1. Update UI and LocalStorage immediately
        setCompletedLessons((prev) => {
            if (prev.includes(lessonId)) return prev;
            const next = [...prev, lessonId];
            localStorage.setItem("lolly_progress", JSON.stringify(next));
            return next;
        });

        // 2. Update Supabase if logged in
        if (user) {
            try {
                const { error } = await supabase
                    .from('user_progress')
                    .upsert({
                        user_id: user.id,
                        lesson_id: lessonId,
                        course_id: courseId,
                        completed: true,
                        last_watched_at: new Date().toISOString()
                    }, { onConflict: 'user_id,lesson_id' });

                if (error) console.error("Supabase progress sync error:", error);
            } catch (err) {
                console.error("Failed to sync progress:", err);
            }
        }
    };

    const isLessonCompleted = (lessonId: string) => completedLessons.includes(lessonId);

    const getProgress = (courseId: string, totalLessons: number, lessonIds?: string[]) => {
        if (totalLessons === 0) return 0;

        // If lessonIds are provided, filter global completed lessons by those IDs
        if (lessonIds && lessonIds.length > 0) {
            const courseCompletedCount = lessonIds.filter(id => completedLessons.includes(id)).length;
            return Math.min(Math.round((courseCompletedCount / totalLessons) * 100), 100);
        }

        // Fallback to global progress if no specific IDs provided
        const completedCount = completedLessons.length;
        return Math.min(Math.round((completedCount / totalLessons) * 100), 100);
    };

    return (
        <ProgressContext.Provider value={{ completedLessons, completeLesson, isLessonCompleted, getProgress, loading }}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgress() {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error("useProgress must be used within a ProgressProvider");
    }
    return context;
}
