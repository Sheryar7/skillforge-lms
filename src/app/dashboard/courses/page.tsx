"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase-client";
import { Course } from "@/features/courses/types/course.types";
import {
    BookOpen,
    Plus,
    GraduationCap,
    PlayCircle,
    Layers,
    Calendar,
    Clock,
    Tag,
    CheckCircle2,
    XCircle,
    UserCheck
} from "lucide-react";
import Spinner from "@/shared/components/Spinner";

interface DisplayCourse extends Course {
    instructor_name?: string;
    total_lessons?: number;
    level?: string;
    duration?: string;
}

interface RequestItem {
    id: string;
    course_id: string;
    student_id: string;
    status: string;
    courses: { title: string };
    profiles: { id: string; email: string };
}

export default function CoursesPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [courses, setCourses] = useState<DisplayCourse[]>([]);
    const [myRequests, setMyRequests] = useState<Record<string, string>>({}); // Maps course_id -> request status
    const [pendingApprovals, setPendingApprovals] = useState<RequestItem[]>([]); // For instructors
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Core Data Aggregator
    const initializeDashboardMatrix = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const currentUserId = session.user.id;
            setUserId(currentUserId);

            // 1. Fetch authenticated role
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", currentUserId)
                .single();

            const role = profile?.role || "student";
            setUserRole(role);

            // 2. Query actual courses infrastructure
            const { data: coursesData } = await supabase
                .from("courses")
                .select("*")
                .order("created_at", { ascending: false });

            if (coursesData) {
                setCourses(coursesData);
            }

            // 3. Conditional state branches based on role
            if (role === "instructor") {
                // Fetch enrollment requests targeted at this instructor's courses
                const { data: incomingReqs } = await supabase
                    .from("enrollment_requests")
                    .select(`
            id,
            course_id,
            student_id,
            status,
            courses!inner(title, instructor_id),
            profiles:student_id(id, email)
          `)
                    .eq("courses.instructor_id", currentUserId)
                    .eq("status", "pending");

                setPendingApprovals((incomingReqs as any) || []);
            } else {
                // Student path: Fetch existing history of enrollment submissions
                const { data: studentReqs } = await supabase
                    .from("enrollment_requests")
                    .select("course_id, status")
                    .eq("student_id", currentUserId);

                if (studentReqs) {
                    const statusMap = studentReqs.reduce((acc, curr) => {
                        acc[curr.course_id] = curr.status;
                        return acc;
                    }, {} as Record<string, string>);
                    setMyRequests(statusMap);
                }
            }
        } catch (err) {
            console.error("Critical Matrix Failure:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initializeDashboardMatrix();
    }, []);

    // --- STUDENT ACTION HANDLERS ---
    const handleEnrollmentRequest = async (courseId: string, instructorId: string) => {
        if (!userId) return;
        setActionLoading(courseId);

        try {
            const { error } = await supabase
                .from("enrollment_requests")
                .insert([
                    {
                        course_id: courseId,
                        student_id: userId,
                        instructor_id: instructorId,
                        status: "pending"
                    }
                ]);

            if (error) throw error;

            setMyRequests(prev => ({ ...prev, [courseId]: "pending" }));
        } catch (err) {
            console.error("Enrollment registration error:", err);
        } finally {
            setActionLoading(null);
        }
    };

    // --- INSTRUCTOR ACTION HANDLERS ---
    const handleAuditRequest = async (requestId: string, statusUpdate: "approved" | "rejected") => {
        setActionLoading(requestId);
        try {
            const { error } = await supabase
                .from("enrollment_requests")
                .update({ status: statusUpdate })
                .eq("id", requestId);

            if (error) throw error;

            // Optimistically clear treated records out of view frame
            setPendingApprovals(prev => prev.filter(req => req.id !== requestId));
        } catch (err) {
            console.error("Status audit state mismatch:", err);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] w-full flex flex-col items-center justify-center">
                <Spinner />
                <p className="text-xs font-black text-slate-400 mt-3 tracking-widest uppercase">Initializing Course Matrix...</p>
            </div>
        );
    }

    const isInstructor = userRole?.toLowerCase() === "instructor";

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto px-1">
            {/* CONTROL DASHBOARD HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-2 w-2 rounded-full bg-violet-600 animate-pulse" />
                        <span className="text-[10px] font-black tracking-widest uppercase text-violet-600">Active Library</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {isInstructor ? "Studio Classroom Control" : "My Learning Workspace"}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 max-w-xl leading-relaxed">
                        {isInstructor
                            ? "Design curriculum paths, assemble lecture modules, and audit system performance nodes effortlessly."
                            : "Continue tracking your personalized educational nodes and interface skill pipelines."}
                    </p>
                </div>

                {isInstructor && (
                    <button
                        onClick={() => alert("Open your CreateCourseModal here!")}
                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-900 hover:bg-violet-600 text-white font-bold text-sm shadow-sm transition-all duration-300 transform active:scale-95 group shrink-0"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        Create Program Track
                    </button>
                )}
            </div>

            {/* INSTRUCTOR INCOMING AUDIT QUEUE BOARD */}
            {isInstructor && pendingApprovals.length > 0 && (
                <div className="bg-amber-50/60 border border-amber-200/70 rounded-[2rem] p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <UserCheck className="text-amber-600 animate-bounce" size={20} />
                        <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">Pending Admission Approvals</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingApprovals.map((req) => (
                            <div key={req.id} className="bg-white border border-amber-100 p-4 rounded-2xl flex flex-col justify-between gap-3 shadow-xs">
                                <div>
                                    <span className="text-[10px] font-black text-violet-600 uppercase tracking-wider block mb-1">Course Target:</span>
                                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{req.courses?.title}</h4>
                                    <p className="text-xs text-slate-400 mt-1 truncate">User: {req.profiles?.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={actionLoading === req.id}
                                        onClick={() => handleAuditRequest(req.id, "approved")}
                                        className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition-all"
                                    >
                                        <CheckCircle2 size={14} /> Approve
                                    </button>
                                    <button
                                        disabled={actionLoading === req.id}
                                        onClick={() => handleAuditRequest(req.id, "rejected")}
                                        className="flex-1 flex items-center justify-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 rounded-xl transition-all"
                                    >
                                        <XCircle size={14} /> Deny
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* LIVE ENGINE DATABASE COURSE GRID */}
            {courses.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                    <BookOpen className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="font-black text-slate-700 text-lg">No active programs found</h3>
                    <p className="text-slate-400 text-sm mt-1">Get started by creating a course to populate your workspace.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => {
                        const currentStatus = myRequests[course.id];

                        return (
                            <div
                                key={course.id}
                                className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-slate-200/60 transition-all duration-300 group relative"
                            >
                                <div>
                                    {/* IMAGING CONTAINER LAYER */}
                                    <div className="relative w-full h-52 bg-slate-100 overflow-hidden">
                                        {course.thumbnail ? (
                                            <Image
                                                src={course.thumbnail}
                                                alt={course.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-800 flex flex-col items-center justify-center text-white p-6 text-center">
                                                <BookOpen size={36} className="mb-2 opacity-80" />
                                                <span className="text-xs font-black uppercase tracking-widest opacity-60">No Thumbnail Uploaded</span>
                                            </div>
                                        )}

                                        {/* Floating Price Tag */}
                                        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl font-black text-xs shadow-sm">
                                            <Tag size={12} className="text-violet-400" />
                                            {course.price === 0 ? "FREE" : `$${course.price}`}
                                        </div>
                                    </div>

                                    {/* INFO BODY DETAILS */}
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[10px] font-black tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg uppercase">
                                                Active Curriculum
                                            </div>
                                        </div>

                                        <h3 className="font-black text-slate-900 text-lg leading-snug group-hover:text-violet-600 transition-colors line-clamp-1">
                                            {course.title}
                                        </h3>

                                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                                            {course.description || "No description provided for this track program resource."}
                                        </p>

                                        {/* METRIC BADGES */}
                                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-500 font-black uppercase tracking-wider">
                                            <span className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                                <PlayCircle size={14} className="text-slate-400" /> 12 Lessons
                                            </span>
                                            <span className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                                <Layers size={14} className="text-slate-400" /> Full Lifetime Access
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ADMISSION WORKFLOW CONTEXT FOOTER */}
                                <div className="p-6 pt-0">
                                    {isInstructor ? (
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                <Calendar size={12} /> Sync Online
                                            </div>
                                            <button className="text-xs font-black text-violet-600 hover:text-slate-900 tracking-widest uppercase transition-colors flex items-center gap-1">
                                                Configure &rarr;
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="pt-4 border-t border-slate-100">
                                            {currentStatus === "approved" && (
                                                <div className="w-full text-center py-3 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-100 flex items-center justify-center gap-1">
                                                    <CheckCircle2 size={14} /> Enrollment Approved! Access Active
                                                </div>
                                            )}

                                            {currentStatus === "pending" && (
                                                <div className="w-full text-center py-3 bg-amber-50 text-amber-700 font-bold text-xs rounded-xl border border-amber-100 animate-pulse">
                                                    ⏱ Request Pending Approval
                                                </div>
                                            )}

                                            {currentStatus === "rejected" && (
                                                <div className="w-full text-center py-3 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl border border-rose-100">
                                                    🛑 Request Rejected by Instructor
                                                </div>
                                            )}

                                            {!currentStatus && (
                                                <button
                                                    disabled={actionLoading === course.id}
                                                    onClick={() => handleEnrollmentRequest(course.id, course.instructor_id)}
                                                    className="w-full text-center py-3 bg-violet-600 hover:bg-slate-900 text-white font-bold text-xs rounded-xl tracking-widest uppercase transition-all duration-300 transform active:scale-95 disabled:opacity-50"
                                                >
                                                    {actionLoading === course.id ? "Sending Request..." : "Request Admission"}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}