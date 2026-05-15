"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Course } from "@/types/course";
import { supabase } from "@/lib/supabase-client";
import { Edit2, X, Settings, Send } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  course?: Course; 
  isStudentView?: boolean;
  hasRequested?: boolean;
};

export default function CourseCard({ course: initialCourse, isStudentView, hasRequested: initialRequested }: Props) {
  
  // Guard Clause: If no course is provided, return a skeleton
  if (!initialCourse) {
    return <div className="bg-slate-50 rounded-[2.5rem] h-96 animate-pulse border border-slate-100" />;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [course, setCourse] = useState(initialCourse);
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(initialRequested);

  const [editTitle, setEditTitle] = useState(initialCourse.title);
  const [editDesc, setEditDesc] = useState(initialCourse.description || "");
  const [editPrice, setEditPrice] = useState(initialCourse.price || 0);
  const [newFile, setNewFile] = useState<File | null>(null);

  const handleEnrollRequest = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to request enrollment");
        return;
      }

      const { error } = await supabase
        .from('enrollment_requests')
        .upsert({
          course_id: initialCourse.id,
          student_id: user.id,
          instructor_id: initialCourse.instructor_id,
          status: 'pending'
        }, { onConflict: 'student_id,course_id' });

      if (error) throw error;
      setRequested(true);
      toast.success("Request sent successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      let updatedThumbnail = course.thumbnail;
      if (newFile) {
        const fileExt = newFile.name.split('.').pop();
        const fileName = `${course.id}-${Date.now()}.${fileExt}`;
        await supabase.storage.from('course-images').upload(`thumbnails/${fileName}`, newFile);
        const { data } = supabase.storage.from('course-images').getPublicUrl(`thumbnails/${fileName}`);
        updatedThumbnail = data.publicUrl;
      }

      const { error } = await supabase.from("courses").update({
        title: editTitle, 
        description: editDesc, 
        price: editPrice, 
        thumbnail: updatedThumbnail,
      }).eq("id", course.id);

      if (error) throw error;
      
      setCourse({ ...course, title: editTitle, description: editDesc, price: editPrice, thumbnail: updatedThumbnail });
      setIsEditing(false);
      toast.success("Course updated!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-200/30 group">
      <div className="relative h-52 overflow-hidden">
        {course.thumbnail ? (
          <Image 
            src={course.thumbnail} 
            alt={course.title} 
            fill 
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-500" />
        )}
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <span className="px-4 py-1.5 bg-violet-50 text-violet-600 text-xs font-black uppercase tracking-tighter rounded-full border border-violet-100">
            {course.price === 0 ? "Free Access" : `$${course.price}`}
          </span>
          {!isStudentView && (
            <button onClick={() => setIsEditing(!isEditing)} className="text-slate-400 hover:text-violet-600 transition-colors">
              {isEditing ? <X size={20} /> : <Edit2 size={20} />}
            </button>
          )}
        </div>

        <h2 className="text-2xl font-black text-black line-clamp-1 tracking-tight">{course.title}</h2>
        <p className="text-slate-500 mt-3 text-sm leading-relaxed line-clamp-2 min-h-[40px]">
          {course.description || "No description provided."}
        </p>

        <div className="mt-8 pt-6 border-t border-slate-50">
          {isStudentView ? (
            <button
              onClick={handleEnrollRequest}
              disabled={requested || loading}
              className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
                ${requested ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-100' : 'bg-violet-600 text-white shadow-lg shadow-violet-200 hover:bg-violet-700'}`}
            >
              {requested ? "Request Pending" : (loading ? "Sending..." : <><Send size={18} /> Request Enrollment</>)}
            </button>
          ) : (
            <Link
              href={`/dashboard/courses/${course.id}`}
              className="flex items-center justify-center gap-2 bg-slate-50 text-violet-600 text-xs font-black uppercase tracking-widest hover:bg-violet-100 py-4 rounded-2xl transition-all"
            >
              <Settings size={14} /> Manage Content
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}