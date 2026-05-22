"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { Edit3, Trash2, Save, BookOpen, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

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
        if (error.code === "23505") {
          toast.error("Enrollment already requested!");
        } else {
          throw error;
        }
      } else {
        toast.success("Request sent! The instructor will review your enrollment.");
        router.refresh();
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to send enrollment request.");
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
        toast.success("Course title updated!");
        setEditing(false);
        router.refresh();
      } else {
        toast.error("Update failed on server.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Something went wrong while updating.");
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
        toast.success("Course deleted successfully.");
        router.refresh();
      } else {
        toast.error("Delete failed.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Something went wrong while deleting.");
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
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
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
              <Button 
                onClick={handleUpdate} 
                isLoading={loading}
                variant="primary"
                className="flex-1 py-3 rounded-xl"
              >
                <Save size={16} />
                <span>Save</span>
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => setEditing(true)} 
                  variant="secondary"
                  className="flex-1 py-3 rounded-xl border-slate-100 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:border-slate-200 shadow-none"
                >
                  <Edit3 size={16} />
                  <span>Edit</span>
                </Button>
                
                <Button 
                  onClick={handleDelete}
                  variant="danger"
                  className="p-3 rounded-xl shadow-none"
                >
                  <Trash2 size={18} />
                </Button>
              </>
            )}
          </div>
        ) : (
          <Button
            onClick={handleEnroll}
            isLoading={loading}
            variant="primary"
            className="w-full py-3 rounded-xl shadow-lg shadow-violet-200"
          >
            <span>Request Access</span>
            <ExternalLink size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}