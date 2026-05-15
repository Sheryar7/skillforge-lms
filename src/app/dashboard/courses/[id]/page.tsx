"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import SectionItem from "@/components/CourseBuilder/SectionItem";
import { Plus, ChevronLeft, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CourseEditor() {
    const params = useParams();
    const id = params?.id as string;

    const [course, setCourse] = useState<any>(null);
    const [sections, setSections] = useState<any[]>([]);
    const [newSectionTitle, setNewSectionTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const loadData = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            
            // 1. Fetch course details
            const { data: courseData, error: courseError } = await supabase
                .from("courses")
                .select("*")
                .eq("id", id)
                .single();

            if (courseError) throw courseError;

            // 2. Fetch existing sections
            const { data: sectionData, error: sectionError } = await supabase
                .from("sections")
                .select("*")
                .eq("course_id", id)
                .order("order_index", { ascending: true });

            if (sectionError) throw sectionError;

            setCourse(courseData);
            setSections(sectionData || []);
        } catch (error: any) {
            console.error("Error loading course data:", error.message);
            toast.error("Could not load course builder");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const addSection = async () => {
        if (!newSectionTitle.trim()) return;

        setIsAdding(true);
        try {
            const { data, error } = await supabase
                .from("sections")
                .insert([
                    {
                        course_id: id,
                        title: newSectionTitle.trim(),
                        order_index: sections.length
                    }
                ])
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                setSections([...sections, data[0]]);
                setNewSectionTitle("");
                toast.success("Section created!");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
                <div className="relative flex items-center justify-center">
                    <Loader2 className="animate-spin text-violet-600 relative z-10" size={48} />
                    <div className="absolute inset-0 bg-violet-200 blur-xl opacity-20 animate-pulse"></div>
                </div>
                <p className="mt-6 font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">Initializing Builder</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="p-20 text-center flex flex-col items-center">
                <div className="bg-slate-50 p-6 rounded-[2.5rem] mb-6">
                    <BookOpen size={40} className="text-slate-300" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Course Not Found</h2>
                <p className="text-slate-500 mt-2 mb-8 max-w-sm">The course ID provided does not exist or has been removed from the database.</p>
                <Link href="/dashboard/courses" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-slate-200">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Navigation Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div>
                    <Link
                        href="/dashboard/courses"
                        className="flex items-center gap-2 text-slate-400 hover:text-violet-600 font-bold mb-4 transition group w-fit text-sm uppercase tracking-wider"
                    >
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Courses
                    </Link>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight capitalize leading-none">
                        {course.title}
                    </h1>
                    <p className="text-slate-400 mt-4 font-bold flex items-center gap-2 uppercase tracking-tighter text-xs">
                        <span className="w-8 h-[2px] bg-violet-500"></span>
                        Curriculum Builder & Video Manager
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Builder Area */}
                <div className="lg:col-span-8 space-y-6">
                    {sections.length > 0 ? (
                        sections.map((section) => (
                            <SectionItem key={section.id} section={section} />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100 mb-6">
                            <p className="text-slate-400 font-bold text-sm">No sections yet. Start building below.</p>
                        </div>
                    )}

                    {/* Section Creation Box */}
                    <div className="bg-white border-4 border-slate-50 rounded-[3rem] p-10 flex flex-col items-center shadow-2xl shadow-slate-100 transition-all hover:border-violet-50 group">
                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                            <Plus size={32} />
                        </div>
                        <input
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addSection()}
                            placeholder="Section Title (e.g. Master the Basics)"
                            disabled={isAdding}
                            className="w-full max-w-md p-5 bg-slate-50 border-none rounded-[2rem] outline-none text-center font-black mb-6 focus:ring-4 ring-violet-100 transition-all text-slate-900 placeholder:text-slate-300 disabled:opacity-50 text-xl"
                        />
                        <button
                            onClick={addSection}
                            disabled={isAdding || !newSectionTitle.trim()}
                            className="bg-slate-900 hover:bg-violet-600 disabled:bg-slate-200 text-white px-12 py-5 rounded-[2rem] font-black flex items-center gap-3 shadow-2xl shadow-slate-200 transition-all active:scale-95 uppercase tracking-widest text-xs"
                        >
                            {isAdding ? <Loader2 className="animate-spin" size={18} /> : null}
                            {isAdding ? "Creating..." : "Create New Section"}
                        </button>
                    </div>
                </div>

                {/* Sidebar Info */}
                <aside className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl overflow-hidden relative">
                        {/* Decorative Background Element */}
                        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-violet-600 rounded-full blur-[100px] opacity-20"></div>
                        
                        <h3 className="font-black text-2xl mb-6 relative z-10">Course Progress</h3>
                        <p className="text-slate-400 text-sm leading-relaxed font-bold mb-10 relative z-10 opacity-80">
                            Sections and Lessons added here will be immediately available to enrolled students.
                        </p>

                        <div className="space-y-6 relative z-10">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Current Status</span>
                                    <span className="text-[10px] font-black text-violet-400 uppercase bg-violet-400/10 px-3 py-1 rounded-full">Draft</span>
                                </div>
                                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-violet-600 to-indigo-500 h-full transition-all duration-1000 ease-out" 
                                        style={{ width: sections.length > 0 ? '25%' : '5%' }}
                                    />
                                </div>
                                <p className="text-[9px] text-slate-500 mt-4 font-black uppercase tracking-widest">
                                    {sections.length} Sections Organized
                                </p>
                            </div>

                            <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 flex items-center justify-center gap-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                    Live Sync Active
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}