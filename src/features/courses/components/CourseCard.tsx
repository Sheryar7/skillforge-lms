"use client";

import { useState, useEffect } from "react";
import { Edit3, Trash2, DollarSign, FileText, Check, X, Video, Clock, Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Course } from "../types/course.types";
import { useCourse } from "../hooks/useCourse";
import { useEnrollment } from "../hooks/useEnrollment";
import { supabase } from "@/lib/supabase-client";

interface CourseCardProps {
  initialCourse: Course;
  isStudentView?: boolean;
  onRefresh?: () => void;
}

export default function CourseCard({ initialCourse, isStudentView = false, onRefresh }: CourseCardProps) {
  const [course, setCourse] = useState<Course>(initialCourse);
  const [isEditing, setIsEditing] = useState(false);
  const { updateCourse, loading: courseLoading } = useCourse();
  const { requestToJoin, loading: requestLoading } = useEnrollment();

  // Enrollment State for current student tracking
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);
  const [checkingEnrollment, setCheckingEnrollment] = useState(isStudentView);

  // Edit fields state
  const [editTitle, setEditTitle] = useState(course.title);
  const [editDesc, setEditDesc] = useState(course.description || "");
  const [editPrice, setEditPrice] = useState<number | "">(course.price);

  // Check the student's enrollment status immediately on mount if in Student View
  useEffect(() => {
    if (!isStudentView) return;

    const checkStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from("enrollment_requests")
          .select("status")
          .eq("student_id", session.user.id)
          .eq("course_id", course.id)
          .maybeSingle();

        if (!error && data) {
          setEnrollmentStatus(data.status);
        }
      } catch (err) {
        console.error("Error fetching request state context:", err);
      } finally {
        setCheckingEnrollment(false);
      }
    };

    checkStatus();
  }, [isStudentView, course.id]);

  const handleJoinRequest = async () => {
    // CRITICAL FIX: Extract instructor_id safely and alert explicitly if missing
    const targetInstructorId = course.instructor_id;

    if (!targetInstructorId) {
      console.error("CRITICAL DATA ERROR: The course payload is missing its 'instructor_id' key properties.", course);
      toast.error("Routing Failure: This course does not have an attached instructor UUID.");
      return;
    }

    try {
      const success = await requestToJoin(course.id, targetInstructorId);
      if (success) {
        setEnrollmentStatus("pending");
        toast.success("Enrollment request transmitted securely!");
        if (onRefresh) onRefresh();
      } else {
        toast.error("Failed to submit request to routing hook.");
      }
    } catch (error: any) {
      console.error("Error within handleJoinRequest client block:", error);
      toast.error(error.message || "An unhandled enrollment lifecycle exception occurred.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = await updateCourse(course.id, {
        title: editTitle,
        description: editDesc,
        price: editPrice === "" ? 0 : editPrice,
      }, null); 

      setCourse(updatedData);
      toast.success("Course modified successfully!");
      setIsEditing(false);
      if (onRefresh) onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save updates.");
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="bg-white border-2 border-violet-200 p-6 rounded-[2.5rem] shadow-xl shadow-violet-50 space-y-4 animate-in fade-in-50 duration-150">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h4 className="font-black text-sm text-slate-700 uppercase tracking-wider">Quick Editor</h4>
          <button type="button" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <Input
            label="Title"
            required
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={courseLoading}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
              <FileText size={14} /> Description
            </label>
            <textarea
              required
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={3}
              className="w-full px-5 py-4 bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 font-bold outline-none transition-all resize-none disabled:opacity-60"
              disabled={courseLoading}
            />
          </div>

          <Input
            label="Price"
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value === "" ? "" : Number(e.target.value))}
            disabled={courseLoading}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={courseLoading}
          className="w-full py-3 rounded-xl"
        >
          {!courseLoading && <Check size={16} />}
          <span>Save Modifications</span>
        </Button>
      </form>
    );
  }

  return (
    <div className="bg-white border border-slate-100 p-5 rounded-[2.5rem] shadow-md hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 flex flex-col group justify-between min-h-[430px]">
      <div>
        {/* Thumbnail Container */}
        <div className="relative w-full h-48 bg-slate-100 rounded-[2rem] overflow-hidden mb-4 border border-slate-50">
          {course.thumbnail ? (
            <Image 
              src={course.thumbnail} 
              alt={course.title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500" 
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
              <Video size={40} strokeWidth={1.5} className="opacity-80" />
            </div>
          )}
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white font-black text-xs flex items-center gap-1 shadow-sm">
            <DollarSign size={12} strokeWidth={2.5} />
            {course.price === 0 ? "Free" : course.price.toFixed(2)}
          </div>
        </div>

        {/* Course Info Content */}
        <div className="px-1">
          <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug line-clamp-1 mb-2 group-hover:text-violet-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-slate-500 font-medium text-sm line-clamp-2 leading-relaxed mb-4">
            {course.description || "No layout outline provided for this curriculum yet."}
          </p>
        </div>
      </div>

      {/* Action Dynamic States Footer */}
      <div className="mt-auto pt-4 border-t border-slate-50">
        {isStudentView ? (
          checkingEnrollment ? (
            <div className="w-full py-3 flex items-center justify-center gap-2 bg-slate-50 rounded-2xl text-slate-400 text-xs font-bold">
              <Loader2 size={14} className="animate-spin" />
              Verifying Authorization Nodes...
            </div>
          ) : enrollmentStatus === "accepted" ? (
            <button 
              onClick={() => alert("Redirecting to Classroom Content view...")}
              className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-1.5 shadow-sm transition-all duration-300"
            >
              Enter Interactive Classroom <ArrowRight size={14} />
            </button>
          ) : enrollmentStatus === "pending" ? (
            <div className="w-full py-3.5 px-5 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 context-pulse animate-pulse">
              <Clock size={14} /> Request Pending Review
            </div>
          ) : enrollmentStatus === "rejected" ? (
            <div className="w-full py-3.5 px-5 bg-red-50 border border-red-100 text-red-600 text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-1.5">
              ✕ Request Declined
            </div>
          ) : (
            <button
              onClick={handleJoinRequest}
              disabled={requestLoading}
              className="w-full py-3.5 px-5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {requestLoading ? "Submitting Request..." : "Request to Join Curriculum"}
            </button>
          )
        ) : (
          /* Instructor Management Dashboard Mode Controls */
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-3 bg-slate-50 hover:bg-violet-50 text-slate-600 hover:text-violet-600 rounded-xl transition-all"
            >
              <Edit3 size={13} /> Edit Course
            </button>
            <button
              onClick={() => toast.error("Delete functionality coming up next migration cycle!")}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}