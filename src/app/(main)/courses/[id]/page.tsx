import { getCourseById } from "@/lib/data/courses";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, BookOpen, User, Star, PlayCircle, ArrowLeft, Award } from "lucide-react";
import Link from "next/link";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const course = await getCourseById(id);

    if (!course) {
        notFound();
    }

    const firstLessonId = course.modules?.[0]?.lessons?.[0]?.id;

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            <Link href="/courses" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Retour au catalogue
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Info */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {course.category}
                            </Badge>
                            <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{course.level}</span>
                        </div>
                        <h1 className="text-5xl font-black text-foreground tracking-tight leading-[1.1]">{course.title}</h1>
                        <p className="text-xl text-muted-foreground font-medium leading-relaxed">{course.description}</p>

                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center font-black text-white shadow-lg shadow-secondary/20">
                                    {course.instructor_name?.[0] || 'L'}
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Expert Mentor</p>
                                    <p className="text-base font-bold text-foreground">{course.instructor_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-2xl border border-border/50">
                                <Star className="h-5 w-5 fill-primary text-primary" />
                                <span className="font-extrabold text-foreground">{course.rating}</span>
                                <span className="text-muted-foreground text-sm font-bold ml-1">(120 avis)</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 bg-muted/20 p-8 rounded-[2rem] border border-border/40 border-dashed">
                        <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
                            <div className="h-8 w-1.5 bg-primary rounded-full" />
                            Ce que vous allez maîtriser
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Maîtriser les outils fondamentaux de l'industrie",
                                "Appliquer des stratégies concrètes et rentables",
                                "Optimiser vos résultats avec des méthodes agiles",
                                "Devenir un expert autonome et recherché"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 group">
                                    <div className="mt-1 flex-shrink-0">
                                        <CheckCircle2 className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-muted-foreground font-semibold leading-snug">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-black text-foreground tracking-tight">Curriculum de la formation</h2>
                        <div className="space-y-4">
                            {course.modules?.map((module, mIdx) => (
                                <Card key={module.id} className="border-border/40 bg-card overflow-hidden rounded-3xl group shadow-sm">
                                    <div className="p-5 flex items-center justify-between bg-muted/30 group-hover:bg-muted/50 transition-colors border-b border-border/40">
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-xs font-black text-muted-foreground">
                                                0{mIdx + 1}
                                            </div>
                                            <h3 className="font-black text-foreground uppercase tracking-wider">{module.title}</h3>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-border/50 text-muted-foreground">
                                            {module.lessons.length} leçons
                                        </Badge>
                                    </div>
                                    <CardContent className="p-0">
                                        {module.lessons.map((lesson) => (
                                            <Link key={lesson.id} href={`/learn/${id}/${lesson.id}`} className="block">
                                                <div className="p-5 flex items-center justify-between border-t border-border/40 hover:bg-muted/20 transition-all cursor-pointer group/lesson active:scale-95">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                        <span className="text-sm font-bold text-muted-foreground group-hover/lesson:text-foreground transition-colors">{lesson.title}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] text-muted-foreground font-black">{lesson.duration}</span>
                                                        <PlayCircle className="h-4 w-4 text-muted-foreground group-hover/lesson:text-primary transition-colors" />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* REVIEWS SECTION */}
                    <ReviewsSection courseId={id} />
                </div>

                {/* Right Column: CTA */}
                <div className="space-y-6">
                    <Card className="sticky top-24 overflow-hidden border-border/40 bg-card shadow-2xl rounded-[2.5rem] border-2">
                        <div className="aspect-video bg-muted relative flex items-center justify-center group cursor-pointer overflow-hidden">
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                            <div className="relative z-20 h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform shadow-primary/20">
                                <PlayCircle className="h-8 w-8 text-black" />
                            </div>
                            <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] font-black text-white uppercase tracking-widest z-20">Aperçu du cours</p>
                        </div>
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-black text-foreground tracking-tighter">
                                        {course.price_fcfa.toLocaleString()} <span className="text-sm font-bold text-muted-foreground">FCFA</span>
                                    </p>
                                </div>
                                <p className="text-sm text-muted-foreground font-bold line-through">
                                    {(course.price_fcfa * 1.5).toLocaleString()} FCFA
                                </p>
                            </div>

                            <div className="space-y-4">
                                {firstLessonId ? (
                                    <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-black h-14 rounded-2xl text-lg shadow-xl shadow-primary/10 transition-all active:scale-[0.98]">
                                        <Link href={`/learn/${id}/${firstLessonId}`}>
                                            Commencer maintenant
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button disabled className="w-full bg-muted text-muted-foreground font-black h-14 rounded-2xl">
                                        Bientôt disponible
                                    </Button>
                                )}
                                <p className="text-[10px] text-center text-muted-foreground font-black uppercase tracking-widest">Accès instantané • Garantie LOLLY</p>
                            </div>

                            <div className="space-y-4 border-t border-border/40 pt-8">
                                <p className="text-xs font-black text-foreground uppercase tracking-widest">Le programme inclut :</p>
                                <div className="space-y-4">
                                    {[
                                        { icon: Clock, text: `${course.duration} de formation HD` },
                                        { icon: BookOpen, text: `${course.modules?.length || 0} modules stratégiques` },
                                        { icon: User, text: "Accès mentorat VIP 24/7" },
                                        { icon: Award, text: "Certificat d'expertise LOLLY" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
                                            <div className="h-8 w-8 rounded-xl bg-muted/50 flex items-center justify-center">
                                                <item.icon className="h-4 w-4 text-primary" />
                                            </div>
                                            {item.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
