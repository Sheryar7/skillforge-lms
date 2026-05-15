"use client";

import { useState } from "react";
import {
  PlayCircle,
  Trash2,
  Info,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase-client";
import VideoUpload from "./VideoUpload";
import toast from "react-hot-toast";

export default function LessonItem({
  lesson,
  sectionId,
  onDelete,
  onSaveSuccess,
}: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [videoUrl, setVideoUrl] = useState(lesson.video_url);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ VIDEO PREVIEW MODAL
  const [showVideo, setShowVideo] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Title required");
    if (!videoUrl) return toast.error("Video required");

    setIsSaving(true);

    const { error } = await supabase
      .from("lessons")
      .update({
        title,
        video_url: videoUrl,
      })
      .eq("id", lesson.id);

    setIsSaving(false);

    if (error) return toast.error(error.message);

    toast.success("Lesson updated");
    setIsEditing(false);
    onSaveSuccess();
  };

  return (
    <>
      {/* VIDEO MODAL */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white w-[80%] max-w-3xl rounded-xl overflow-hidden shadow-2xl">
            <div className="flex justify-between p-4 border-b items-center">
              <h2 className="font-bold text-black">{lesson.title}</h2>
              <button 
                onClick={() => setShowVideo(false)}
                className="hover:bg-slate-100 p-1 rounded-full transition-colors cursor-pointer"
              >
                <X className="text-slate-500" />
              </button>
            </div>

            <video
              src={lesson.video_url}
              controls
              className="w-full bg-black"
              autoPlay
            />
          </div>
        </div>
      )}

      {/* DISPLAY MODE */}
      {!isEditing ? (
        <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200 hover:border-violet-200 transition-all group">

          <div className="flex items-center gap-3">
            <PlayCircle
              className="text-violet-600 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setShowVideo(true)}
            />

            <div>
              <p className="font-bold text-sm text-black">
                {lesson.title}
              </p>
            </div>
          </div>

          <div className="flex gap-1">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all cursor-pointer"
            >
              <Info size={18} />
            </button>

            <button 
              onClick={() => onDelete(lesson.id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          </div>

        </div>
      ) : (
        <div className="p-5 border border-violet-100 rounded-2xl bg-white space-y-4 shadow-lg shadow-violet-50">

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Lesson title"
            className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 ring-violet-100 focus:border-violet-300 transition-all text-black font-semibold"
          />

          <div className="rounded-xl overflow-hidden">
            <VideoUpload
              onUploadComplete={(url: string) =>
                setVideoUrl(url)
              }
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-md shadow-violet-100"
            >
              {isSaving ? "Saving..." : "Save Lesson"}
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 text-slate-500 font-bold hover:text-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </div>
      )}
    </>
  );
}