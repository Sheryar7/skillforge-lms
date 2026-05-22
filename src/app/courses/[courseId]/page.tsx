"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, PlayCircle, BookOpen, Clock, Calendar } from "lucide-react";
import toast from "react-hot-toast";

// Importing your clean shared design tokens
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import Spinner from "@/shared/components/Spinner";

// Components from your custom features space
import SectionList from "@/features/sections/components/SectionList";
import VideoPlayer from "@/features/video/components/VideoPlayer";

import { supabase } from "@/lib/supabase-client";
import { Course } from "@/types/database";

interface CourseDetailPageProps {
    params: Promise<{ courseId: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
    // Unwrapping Next.js dynamic parameters mapping asynchronously
    const { courseId } = use(params);

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
    const [previewTitle, setPreviewTitle] = useState<string>("");

    useEffect(() => {
        async function fetchCourseData() {
            try {
                const { data, error } = await supabase
                    .from("courses")
                    .select("*")
                    .eq("id", courseId)
                    .single();

                if (error) throw error;
                setCourse(data);
            } catch (err: any) {
                toast.error("Failed to load course track information parameters.");
            } finally {
                setLoading(false);
            }
        }

        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Spinner />
                <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">Mounting lecture environment module...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

            {/* Return Catalog Header Banner */}
            <div className="space-y-2">
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-700 uppercase tracking-wider transition-colors"
                >
                    <ArrowLeft size={14} strokeWidth={2.5} /> Back to Public Directory
                </Link>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
                    <div className="space-y-3 max-w-3xl">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            {course?.title || "Classroom Syllabus Track"}
                        </h1>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            {course?.description || "No deep informational description has been written for this module block matrix yet."}
                        </p>

                        {/* Micro Metadata Metrics Badges */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 pt-1">
                            <span className="flex items-center gap-1.5"><BookOpen size={14} /> Full Syllabus Included</span>
                            <span className="flex items-center gap-1.5"><Clock size={14} /> Self-Paced Timing</span>
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} /> Updated {course?.updated_at ? new Date(course.updated_at).toLocaleDateString() : "Recently"}
                            </span>
                        </div>
                    </div>

                    {/* Call to action action trigger card wrapper panel */}
                    <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm min-w-[18rem] space-y-4">
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Access Tier</span>
                            <h3 className="text-xl font-black text-slate-900">Free Open-Source</h3>
                        </div>
                        <Button
                            variant="primary"
                            className="w-full py-4 text-sm font-black rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center gap-2"
                            onClick={() => {
                                // Quick feature handler hook to announce class tracking mechanics
                                toast.success("Enrolled into content track nodeset!");
                            }}
                        >
                            <PlayCircle size={16} />
                            <span>Begin Track Route</span>
                        </Button>
                    </div>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Main Framework Content Layout Grid Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">Curriculum Breakdown</h2>
                        <p className="text-xs text-slate-400 font-medium">Browse published chapters and content blocks below</p>
                    </div>

                    {/* Injecting SectionList with editing options disabled for standard students */}
                    <SectionList courseId={courseId} isInstructor={false} />
                </div>

                {/* Sidebar Classroom Requirement Panel Block Info */}
                <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-[2.5rem] space-y-4">
                    <h4 className="font-black text-slate-900 text-sm tracking-tight">Course Requirements</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        No strict software setups required up front. All target curriculum sandboxes, code blocks, and asset streams operate natively inside your active web terminal layout workspace window interface.
                    </p>
                </div>
            </div>

            {/* Unified Base Layout Preview Modal Context Mount Block */}
            <Modal
                isOpen={activePreviewUrl !== null}
                onClose={() => setActivePreviewUrl(null)}
                title={previewTitle}
            >
                <div className="rounded-[2rem] overflow-hidden bg-black mt-3 w-full max-w-4xl">
                    <VideoPlayer url={activePreviewUrl} />
                </div>
            </Modal>

        </div>
    );
}