"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import LessonItem from "./LessonItem";
import VideoUpload from "./VideoUpload";
import { Plus, Layout, Loader2, Pencil } from "lucide-react";
import toast from "react-hot-toast";

export default function SectionItem({ section }: any) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [savingLesson, setSavingLesson] = useState(false);

  // ✅ SECTION EDIT
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [sectionTitle, setSectionTitle] = useState(section.title);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("section_id", section.id)
      .order("order_index", { ascending: true });

    if (error) return toast.error(error.message);
    setLessons(data || []);
  };

  // ✅ UPDATE SECTION TITLE
  const updateSectionTitle = async () => {
    const { error } = await supabase
      .from("sections")
      .update({ title: sectionTitle })
      .eq("id", section.id);

    if (error) return toast.error(error.message);

    toast.success("Section updated");
    setIsEditingSection(false);
  };

  // ADD LESSON
  const addLesson = async () => {
    if (!newLessonTitle.trim()) return toast.error("Enter title");
    if (!videoUrl) return toast.error("Upload video");

    setSavingLesson(true);

    const { data, error } = await supabase
      .from("lessons")
      .insert([
        {
          section_id: section.id,
          title: newLessonTitle.trim(),
          video_url: videoUrl,
          order_index: lessons.length,
        },
      ])
      .select();

    setSavingLesson(false);

    if (error) return toast.error(error.message);

    toast.success("Lesson added");

    setLessons([...lessons, data[0]]);
    setNewLessonTitle("");
    setVideoUrl("");
    setShowAddLesson(false);
  };

  // DELETE LESSON
  const deleteLesson = async (lessonId: string) => {
    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", lessonId);

    if (error) return toast.error(error.message);

    toast.success("Lesson deleted");
    fetchLessons();
  };

  return (
    <div className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 mb-6">

      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-6">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          <Layout className="text-slate-400" size={20} />

          {/* SECTION TITLE EDIT */}
          {isEditingSection ? (
            <input
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              onBlur={updateSectionTitle}
              className="font-black text-slate-800 bg-white px-2 py-1 rounded-lg border"
              autoFocus
            />
          ) : (
            <h3 className="text-lg font-black text-slate-800">
              {sectionTitle}
            </h3>
          )}

        </div>

        {/* EDIT BUTTON */}
        <button
          onClick={() => setIsEditingSection(true)}
          className="text-slate-400 hover:text-violet-600"
        >
          <Pencil size={18} />
        </button>
      </div>

      {/* LESSONS */}
      <div className="space-y-2 mb-4">
        {lessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            sectionId={section.id}
            onDelete={deleteLesson}
            onSaveSuccess={fetchLessons}
          />
        ))}
      </div>

      {/* ADD LESSON */}
      {showAddLesson ? (
        <div className="bg-white p-5 rounded-2xl border space-y-4">

          <input
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
            placeholder="Lesson title"
            className="w-full p-3 border rounded-xl"
          />

          <VideoUpload
            onUploadComplete={(url) => setVideoUrl(url)}
          />

          <button
            onClick={addLesson}
            disabled={savingLesson}
            className="bg-violet-600 text-white px-4 py-3 rounded-xl w-full"
          >
            {savingLesson ? "Saving..." : "Save Lesson"}
          </button>

        </div>
      ) : (
        <button
          onClick={() => setShowAddLesson(true)}
          className="text-violet-600 font-bold flex items-center gap-2"
        >
          <Plus size={16} /> Add Lesson
        </button>
      )}
    </div>
  );
}