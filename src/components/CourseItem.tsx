"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { Edit3, Trash2, Save, BookOpen, ExternalLink, Loader2 } from "lucide-react";

type Props = {
  course: {
    id: string | number;
    title: string;
    description?: string;
  };
  isOwner: boolean;
};

export default function CourseItem({ course, isOwner }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(course.title);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { error } = await supabase
        .from("enrollments")
        .insert([{
          user_id: user.id,
          course_id: course.id,
          status: "pending" 
        }]);

      if (error) {
        if (error.code === "23505") alert("Enrollment already requested!");
        else throw error;
      } else {
        alert("Request sent! The instructor will review your enrollment.");
        router.refresh();
      }
    } catch (error: any) {
      console.error(error);
      alert("Failed to send enrollment request.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        setEditing(false);
        router.refresh();
      } else {
        alert("Update failed on server.");
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/courses/${course.id}`, { method: "DELETE" });
      if (response.ok) {
        router.refresh();
      } else {
        alert("Delete failed.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-violet-100/50 flex flex-col h-full text-slate-800">
      <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 mb-4">
        <BookOpen size={24} />
      </div>

      <div className="flex-1">
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-violet-100 focus:border-violet-600 focus:outline-none transition-all font-bold"
            autoFocus
          />
        ) : (
          <>
            <h3 className="text-xl font-black line-clamp-2 min-h-[3.5rem]">{course.title}</h3>
            <p className="text-slate-400 text-sm mt-2 line-clamp-2">
              {course.description || "Learn modern development with Sherry LMS."}
            </p>
          </>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between gap-3">
        {isOwner ? (
          <div className="flex gap-2 w-full">
            {editing ? (
              <button 
                onClick={handleUpdate} 
                disabled={loading}
                className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-violet-700 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save</>}
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setEditing(true)} 
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                >
                  <Edit3 size={16} /> Edit
                </button>
                <button 
                  onClick={handleDelete}
                  className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={handleEnroll}
            disabled={loading}
            className="w-full bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Request Access <ExternalLink size={16} /></>}
          </button>
        )}
      </div>
    </div>
  );
}