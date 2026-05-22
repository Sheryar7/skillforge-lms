"use client";

import { useState, useEffect } from "react";
import { Plus, X, Video, Clock } from "lucide-react";
import toast from "react-hot-toast";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import { createLessonAction } from "../actions/createLesson";
import { updateLessonAction } from "../actions/updateLesson";
import { Lesson } from "../types/lesson.types";

interface LessonEditorModalProps {
  sectionId: string;
  courseId: string;
  lesson?: Lesson;
  onSaved?: () => void;
  triggerLabel?: string;
}

export default function LessonEditorModal({
  sectionId,
  courseId,
  lesson,
  onSaved,
  triggerLabel,
}: LessonEditorModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(lesson?.title || "");
  const [description, setDescription] = useState(lesson?.description || "");
  const [videoUrl, setVideoUrl] = useState(lesson?.video_url || "");
  const [duration, setDuration] = useState(lesson?.duration || "");
  const [isPreview, setIsPreview] = useState(lesson?.is_preview || false);
  const [isPublished, setIsPublished] = useState(lesson?.published ?? false);

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setDescription(lesson.description || "");
      setVideoUrl(lesson.video_url || "");
      setDuration(lesson.duration || "");
      setIsPreview(lesson.is_preview);
      setIsPublished(lesson.published ?? false);
    }
  }, [lesson]);

  const isEditMode = Boolean(lesson?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please add a lesson title.");
      return;
    }

    setLoading(true);
    try {
      const result = isEditMode
        ? await updateLessonAction(lesson!.id, {
            title: title.trim(),
            description: description.trim() || null,
            video_url: videoUrl.trim() || null,
            duration: duration.trim() || null,
            is_preview: isPreview,
            published: isPublished,
          })
        : await createLessonAction({
            title: title.trim(),
            section_id: sectionId,
            course_id: courseId,
            description: description.trim() || null,
            video_url: videoUrl.trim() || null,
            duration: duration.trim() || null,
            is_preview: isPreview,
            published: isPublished,
          });

      if (!result.success) throw new Error(result.error);
      toast.success(isEditMode ? "Lesson saved successfully!" : "Lesson created successfully!");

      if (!isEditMode) {
        setTitle("");
        setDescription("");
        setVideoUrl("");
        setDuration("");
        setIsPreview(false);
        setIsPublished(false);
      }

      setIsOpen(false);
      if (onSaved) onSaved();
    } catch (err: any) {
      toast.error(err.message || "Failed to save lesson.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full py-3 border border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold text-xs flex items-center justify-center gap-2 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/20 transition-all"
      >
        <Plus size={14} /> {isEditMode ? "Edit lesson" : "Add Lesson"}
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={isEditMode ? "Edit lesson" : "Add new lesson"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Lesson title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Getting started with the dashboard"
            disabled={loading}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
              <Video size={14} /> Lesson description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Add a short lesson summary."
              className="w-full px-5 py-4 bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all resize-none disabled:opacity-60"
              disabled={loading}
            />
          </div>

          <Input
            label="Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://..."
            disabled={loading}
          />

          <Input
            label="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 08:30"
            disabled={loading}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.24em] text-slate-500">
              <input
                type="checkbox"
                checked={isPreview}
                onChange={(e) => setIsPreview(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                disabled={loading}
              />
              Free preview lesson
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

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)} disabled={loading}>
              <X size={14} /> Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Add lesson
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
