"use client";

import { useState } from "react";
import { Plus, X, PlusCircle, Video } from "lucide-react";
import toast from "react-hot-toast";

// Importing your clean shared design primitives
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { createLessonAction } from "../actions/createLesson";

interface LessonEditorProps {
  sectionId: string;
  courseId: string;
  onLessonAdded?: () => void;
}

export default function LessonEditor({ sectionId, courseId, onLessonAdded }: LessonEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createLessonAction({
        title,
        section_id: sectionId,
        course_id: courseId,
        is_preview: isPreview,
      });

      if (!result.success) throw new Error(result.error);

      toast.success("Lesson added successfully!");
      setTitle("");
      setIsPreview(false);
      setIsOpen(false);
      if (onLessonAdded) onLessonAdded();
    } catch (err: any) {
      toast.error(err.message || "Failed to attach lesson.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 border border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/20 transition-all"
      >
        <Plus size={14} />
        <span>Add Lesson Content</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-3 animate-in slide-in-from-top-4 duration-200">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
          <Video size={12}/> New Content Node
        </span>
        <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Global primitive design text input element layout token */}
      <Input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Introduction to CSS Grid"
        disabled={loading}
      />

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPreview}
            onChange={(e) => setIsPreview(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 disabled:opacity-50"
            disabled={loading}
          />
          <span className="text-xs font-bold text-slate-500">Allow free preview without enrollment</span>
        </label>

        {/* Global Button element which handles injecting the design token Spinner automatically inside layout hierarchy */}
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          className="px-4 py-2 text-xs rounded-xl shadow-md"
        >
          {!loading && <PlusCircle size={12} />}
          <span>Publish Node</span>
        </Button>
      </div>
    </form>
  );
}