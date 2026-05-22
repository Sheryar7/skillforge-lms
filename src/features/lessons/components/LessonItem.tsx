"use client";

import { useState } from "react";
import { Play, Video, Trash2, Eye, EyeOff, Check, X, Edit2, ArrowUp, ArrowDown, Clock } from "lucide-react";
import toast from "react-hot-toast";

// Importing your clean shared design primitives
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Lesson } from "../types/lesson.types";
import { updateLessonAction } from "../actions/updateLesson";
import { deleteLessonAction } from "../actions/deleteLesson";
import { moveLessonAction } from "../actions/moveLesson";

interface LessonItemProps {
  lesson: Lesson;
  onRefresh: () => void;
  isInstructor?: boolean;
}

export default function LessonItem({ lesson, onRefresh, isInstructor = true }: LessonItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editTitle, setEditTitle] = useState(lesson.title);
  const [editDescription, setEditDescription] = useState(lesson.description || "");
  const [editVideoUrl, setEditVideoUrl] = useState(lesson.video_url || "");
  const [editDuration, setEditDuration] = useState(lesson.duration || "");
  const [isPreview, setIsPreview] = useState(lesson.is_preview);
  const [isPublished, setIsPublished] = useState(lesson.published ?? false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updates: any = {
        title: editTitle,
        description: editDescription || null,
        video_url: editVideoUrl || null,
        duration: editDuration || null,
        is_preview: isPreview,
      };

      if (lesson.published !== undefined) {
        updates.published = isPublished;
      }

      const result = await updateLessonAction(lesson.id, updates);
      if (!result.success) throw new Error(result.error);
      toast.success("Lesson updated!");
      setIsEditing(false);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update lesson.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    setLoading(true);
    try {
      const result = await deleteLessonAction(lesson.id);
      if (!result.success) throw new Error(result.error);
      toast.success("Lesson removed!");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete lesson.");
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (direction: "up" | "down") => {
    setLoading(true);
    try {
      const result = await moveLessonAction(lesson.section_id, lesson.id, direction);
      if (!result.success) throw new Error(result.error);
      toast.success("Lesson order updated.");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to reorder lesson.");
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="space-y-4 bg-slate-50 p-4 rounded-2xl border-2 border-violet-200 animate-in fade-in duration-150">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            required
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={loading}
          />
          <Input
            value={editVideoUrl}
            onChange={(e) => setEditVideoUrl(e.target.value)}
            placeholder="Video URL"
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
            <Video size={14} /> Description
          </label>
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={4}
            className="w-full px-5 py-4 bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 font-medium text-sm outline-none transition-all resize-none disabled:opacity-60"
            disabled={loading}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            value={editDuration}
            onChange={(e) => setEditDuration(e.target.value)}
            placeholder="Duration e.g. 08:30"
            disabled={loading}
          />
          <div className="grid gap-3">
            <label className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.24em] text-slate-500">
              <input
                type="checkbox"
                checked={isPreview}
                onChange={(e) => setIsPreview(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                disabled={loading}
              />
              Free preview
            </label>
            <label className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.24em] text-slate-500">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                disabled={loading}
              />
              Published lesson
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsEditing(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading} className="w-full sm:w-auto">
            Save lesson
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl">
            <Play size={16} fill="currentColor" className="ml-0.5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-bold text-slate-800 text-sm tracking-tight">{lesson.title}</h4>
              {lesson.published !== undefined && (
                <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider ${lesson.published ? "text-emerald-600 bg-emerald-50" : "text-slate-500 bg-slate-100"}`}>
                  {lesson.published ? "Published" : "Draft"}
                </span>
              )}
              {lesson.is_preview && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
                  <Eye size={10} /> Preview
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">{lesson.description || "No lesson description available."}</p>
            {lesson.duration && (
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-500 uppercase tracking-[0.2em] font-black">
                <Clock size={12} /> {lesson.duration}
              </span>
            )}
          </div>
        </div>

        {isInstructor && (
          <div className="flex flex-wrap items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={() => handleMove("up")}
              variant="secondary"
              className="p-2 text-slate-400 hover:text-violet-600 border-none shadow-none rounded-xl"
              disabled={loading}
            >
              <ArrowUp size={14} />
            </Button>
            <Button
              onClick={() => handleMove("down")}
              variant="secondary"
              className="p-2 text-slate-400 hover:text-violet-600 border-none shadow-none rounded-xl"
              disabled={loading}
            >
              <ArrowDown size={14} />
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              variant="secondary"
              className="p-2 text-slate-400 hover:text-violet-600 border-none shadow-none rounded-xl"
            >
              <Edit2 size={14} />
            </Button>
            <Button
              onClick={handleDelete}
              variant="danger"
              className="p-2 text-slate-400 hover:text-red-500 border-none shadow-none rounded-xl"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </div>

      {lesson.video_url && (
        <div className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-500 text-xs font-medium">
          <span className="font-black text-slate-700">Video source:</span> {lesson.video_url}
        </div>
      )}
    </div>
  );
}