import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowRight, Play, BookOpen, Clock, Star, Zap, ShieldCheck, Target, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  const featuredCourses = courses || [];

  return (
    <div className="space-y-24 pb-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-[#050505] py-24 md:py-32 px-8 text-white border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-[120px]" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-10">
          <Badge className="bg-white/5 text-primary border-primary/20 hover:bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
            L'excellence signée LOLLY
          </Badge>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter max-w-5xl leading-[0.95] md:leading-[0.9]">
            Propulsez votre <span className="text-primary italic">Caractère</span> vers le <span className="text-secondary">Succès</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            La plateforme d'élite pour maîtriser les compétences de demain. Apprenez des meilleurs, mesurez votre impact et transformez votre vision en réalité.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            <Link href="/courses">
              <Button size="lg" className="h-16 px-10 bg-primary text-primary-foreground hover:bg-primary/90 font-black rounded-2xl text-lg shadow-[0_20px_50px_-10px_rgba(59,130,246,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                Explorer le Catalogue <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="lg" className="h-16 px-10 text-white hover:bg-white/5 font-black uppercase tracking-widest text-xs border border-white/10 rounded-2xl backdrop-blur-xl">
              <Play className="mr-3 h-4 w-4 fill-white" /> Voir la démo
            </Button>
          </div>

          <div className="flex items-center gap-8 pt-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="h-8 w-24 bg-white/10 rounded-lg flex items-center justify-center font-black text-[10px] tracking-widest uppercase">Expertise</div>
            <div className="h-8 w-24 bg-white/10 rounded-lg flex items-center justify-center font-black text-[10px] tracking-widest uppercase">Performance</div>
            <div className="h-8 w-24 bg-white/10 rounded-lg flex items-center justify-center font-black text-[10px] tracking-widest uppercase">Impact</div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
        {[
          { icon: ShieldCheck, title: "Excellence Garantie", desc: "Contenu premium validé par des experts du domaine." },
          { icon: Target, title: "Focus Résultats", desc: "Des parcours conçus pour un impact direct sur votre carrière." },
          { icon: Users, title: "Communauté Élite", desc: "Rejoignez un réseau de professionnels ambitieux." },
        ].map((feature, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-4 group">
            <div className="h-16 w-16 rounded-[1.5rem] bg-muted flex items-center justify-center border border-border/40 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-500 group-hover:shadow-[0_10px_30px_-5px_rgba(59,130,246,0.1)]">
              <feature.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{feature.title}</h3>
            <p className="text-muted-foreground font-medium text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Featured Courses Header */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Sélection d'Or</p>
            <h2 className="text-5xl font-black text-foreground tracking-tighter">Formations Phares</h2>
          </div>
          <Link href="/courses">
            <Button variant="link" className="text-foreground hover:text-primary font-black uppercase tracking-widest text-xs p-0 h-auto">
              Accéder au catalogue complet <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {featuredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="group overflow-hidden border-border/40 bg-card hover:border-primary/40 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] rounded-[2rem]">
                <div className="aspect-[16/10] bg-zinc-900 relative overflow-hidden">
                  {course.thumbnail_url && (
                    <img src={course.thumbnail_url} alt={course.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                  )}
                  <div className="absolute top-4 left-4 z-10 glass px-4 py-2 rounded-xl text-[10px] font-black text-white flex items-center gap-2 shadow-2xl uppercase tracking-widest bg-black/40">
                    <Star className="h-3 w-3 fill-primary text-primary" /> {course.rating || "5.0"} <span className="text-white/40">| TOP</span>
                  </div>
                  <div className="absolute inset-x-6 bottom-6 flex items-center justify-between text-white z-10">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{course.level || "Niveau Expert"}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">{course.category}</span>
                    <CardTitle className="text-2xl font-black leading-tight group-hover:text-primary transition-colors text-foreground line-clamp-2">{course.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-muted-foreground font-black uppercase tracking-widest">
                    <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> 12 Modules</span>
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {course.duration || "24h"}</span>
                  </div>
                  <div className="pt-6 border-t border-border/40 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Investissement</p>
                      <p className="text-xl font-black text-foreground">{course.price_fcfa?.toLocaleString()} <span className="text-xs">FCFA</span></p>
                    </div>
                    <Link href="/courses">
                      <Button variant="outline" className="rounded-xl border-border/40 font-black text-[10px] uppercase tracking-widest h-12 px-6 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-lg active:scale-95">
                        Explorer
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-zinc-900/10 rounded-[3rem] border border-dashed border-white/5">
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Le catalogue est en cours de synchronisation...</p>
          </div>
        )}
      </section>

      {/* Impact Stats */}
      <section className="relative rounded-[3rem] border border-border/40 bg-muted/20 p-12 md:p-20 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 blur-[80px] rounded-full" />
        <div className="absolute bottom-0 left-0 h-64 w-64 bg-secondary/5 blur-[80px] rounded-full" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20 text-center relative z-10">
          {[
            { value: "2500+", label: "Apprenants D'Élite" },
            { value: "50+", label: "Parcours Stratégiques" },
            { value: "98%", label: "Taux de Satisfaction" },
            { value: "12h", label: "Accès Mentorat VIP" },
          ].map((stat, i) => (
            <div key={i} className="space-y-4 group cursor-default">
              <div className="text-5xl md:text-6xl font-black text-primary tracking-tighter group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl">
                {stat.value}
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="flex flex-col items-center text-center space-y-8 bg-primary/5 py-20 rounded-[3rem] border border-primary/20 backdrop-blur-sm relative overflow-hidden">
        <div className="space-y-4 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">Prêt à dominer votre marché ?</h2>
          <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto">Rejoignez le cercle restreint des experts LOLLY et transformez votre ambition en expertise.</p>
        </div>
        <Link href="/signup">
          <Button size="lg" className="h-16 px-12 bg-primary text-primary-foreground hover:bg-primary/90 font-black rounded-2xl text-lg shadow-[0_20px_50px_-10px_rgba(59,130,246,0.4)] relative z-10">
            Créer mon compte expert
          </Button>
        </Link>
        <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-primary/10 blur-[60px] rounded-full" />
      </section>
    </div>
  );
}

