"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { getCourses, type Course } from "@/lib/data/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    BookOpen
} from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function load() {
            const data = await getCourses();
            setCourses(data);
            setLoading(false);
        }
        load();
    }, []);

    const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Gestion des Cours</h1>
                    <p className="text-zinc-500 text-sm font-medium">Créez et modifiez vos programmes de formation.</p>
                </div>
                <Link href="/admin/courses/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl px-6 h-12">
                        <Plus className="mr-2 h-4 w-4" /> Créer un cours
                    </Button>
                </Link>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Rechercher un cours..."
                            className="pl-10 bg-zinc-950 border-white/10 text-white placeholder:text-zinc-600"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-white/[0.02]">
                        <TableRow className="hover:bg-transparent border-white/5">
                            <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest pl-6">Formation</TableHead>
                            <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Prix</TableHead>
                            <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Modules</TableHead>
                            <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Catégorie</TableHead>
                            <TableHead className="text-right text-zinc-400 font-bold uppercase text-[10px] tracking-widest pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow className="border-white/5">
                                <TableCell colSpan={5} className="h-32 text-center text-zinc-500 font-medium">
                                    Aucun cours trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((course) => (
                                <TableRow key={course.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <TableCell className="pl-6 font-medium text-zinc-200">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
                                                {course.thumbnail_url ? (
                                                    <img src={course.thumbnail_url} className="h-full w-full object-cover" />
                                                ) : (
                                                    <BookOpen className="h-5 w-5 text-zinc-600" />
                                                )}
                                            </div>
                                            <span className="font-bold">{course.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-zinc-400 font-mono text-xs">{course.price_fcfa.toLocaleString()} FCFA</TableCell>
                                    <TableCell className="text-zinc-400 font-bold">
                                        {course.modules?.length || 0}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-400 text-[10px] uppercase tracking-wider">
                                            {course.category || "Général"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-500 hover:text-white">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40 bg-zinc-950 border-white/10 text-zinc-300">
                                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-zinc-600">Actions</DropdownMenuLabel>
                                                <div className="h-px bg-white/5 my-1" />
                                                <DropdownMenuItem className="focus:bg-orange-600 focus:text-white cursor-pointer">
                                                    <Pencil className="mr-2 h-3.5 w-3.5" /> Éditer
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                                                    <Eye className="mr-2 h-3.5 w-3.5" /> Voir
                                                </DropdownMenuItem>
                                                <div className="h-px bg-white/5 my-1" />
                                                <DropdownMenuItem className="focus:bg-red-900/50 focus:text-red-400 text-red-500 cursor-pointer">
                                                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
