"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CloudUpload,
  Edit3,
  GripVertical,
  Layers,
  Loader2,
  MoveVertical,
  Settings2,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import SectionList from "@/features/sections/components/SectionList";
import { useSections } from "@/features/sections/hooks/useSections";
import { useCourseLessons } from "@/features/lessons/hooks/useCourseLessons";
import { Course } from "../types/course.types";
import { updateCourseAction } from "../actions/updateCourse";
import { Button } from "@/shared/ui/button";

interface CourseEditorProps {
  course: Course;
  onCourseUpdated?: (course: Course) => void;
}

function formatDuration(totalSeconds: number) {
  if (totalSeconds === 0) return "0m";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function CourseEditor({ course, onCourseUpdated }: CourseEditorProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [localPublished, setLocalPublished] = useState(course.published ?? course.status === "published");

  const { sections, loading: sectionsLoading, error: sectionsError, refresh: refreshSections } = useSections(course.id);
  const { lessons, loading: lessonsLoading, error: lessonsError, refresh: refreshLessons } = useCourseLessons(course.id);

  const totalDuration = useMemo(() => {
    const seconds = lessons.reduce((sum, lesson) => {
      if (!lesson.duration) return sum;
      const parts = lesson.duration.split(":").map((part) => Number(part));
      if (parts.length === 3) {
        return sum + parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
      if (parts.length === 2) {
        return sum + parts[0] * 60 + parts[1];
      }
      return sum + (Number(parts[0]) || 0);
    }, 0);
    return formatDuration(seconds);
  }, [lessons]);

  const handlePublishToggle = async () => {
    setIsPublishing(true);
    try {
      const result = await updateCourseAction(course.id, {
        published: !localPublished,
        status: !localPublished ? "published" : "draft",
      });
      if (!result.success) throw new Error(result.error);
      if (!result.data) throw new Error("Course update did not return updated data.");
      setLocalPublished(result.data.published ?? result.data.status === "published");
      toast.success(!localPublished ? "Course published successfully." : "Course moved back to draft.");
      if (onCourseUpdated) onCourseUpdated(result.data);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Unable to change course publish state."));
    } finally {
      setIsPublishing(false);
    }
  };

  const statusClasses = localPublished
    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
    : "border-amber-400/30 bg-amber-400/10 text-amber-300";

  return (
    <div className="relative space-y-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 rounded-full bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.14),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.12),transparent_35%)]" />

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-[0_24px_90px_rgba(2,6,23,0.28)]">
        <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,1))] p-6 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/20 sm:w-44">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-500">
                    <BookOpen size={34} />
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.24em] text-violet-200">
                    <Layers size={13} />
                    Course management
                  </span>
                  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.24em] ${statusClasses}`}>
                    <CheckCircle2 size={13} />
                    {localPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                    {course.title || "Full Stack LMS Development"}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-400">
                    {course.description || "Build, organize, and publish a polished learning path for students from one focused instructor workspace."}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Sections</p>
                    <p className="mt-2 text-2xl font-black text-white">{sections.length}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Lessons</p>
                    <p className="mt-2 text-2xl font-black text-white">{lessons.length}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Enrollments</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-2xl font-black text-white">
                      <Users size={18} className="text-cyan-400" />
                      128
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-300"
              >
                <Edit3 size={16} />
                Edit Course
              </button>
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl"
              >
                <Settings2 size={16} />
                Manage Curriculum
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.35fr_0.65fr] lg:p-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-300">Curriculum builder</p>
                <h2 className="mt-2 text-xl font-black tracking-tight text-white">Structured content tree</h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-black text-cyan-300">
                <Sparkles size={14} />
                Active editing
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                <div className="flex items-center gap-3">
                  <GripVertical size={18} className="text-slate-600" />
                  <div className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-black text-white">
                    Section 1: Database Architecture & Layout
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <button className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-black text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-300">Rename</button>
                    <button className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-black text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-300">Move</button>
                    <button className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-black text-rose-300 transition hover:border-rose-400/50">Delete</button>
                  </div>
                </div>

                <div className="ml-4 mt-4 space-y-3 border-l border-slate-700 pl-5">
                  {["Auth schema setup", "Profile policies", "Enrollment joins"].map((chapter) => (
                    <div key={chapter} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <MoveVertical size={15} className="text-slate-600" />
                      <div className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-200">
                        {chapter}
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-cyan-300" aria-label="Rename chapter">
                          <Edit3 size={14} />
                        </button>
                        <button className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-cyan-300" aria-label="Move chapter">
                          <ArrowRight size={14} />
                        </button>
                        <button className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-rose-300" aria-label="Delete chapter">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/80 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-300">
                          <CloudUpload size={22} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">Drag & drop video here or browse</p>
                          <p className="mt-1 text-xs font-medium text-slate-500">lessons/auth-setup.mp4 - 78%</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-black text-cyan-300">Uploading</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Estimated duration</p>
              <p className="mt-3 text-3xl font-black text-white">{totalDuration}</p>
              <p className="mt-2 text-sm text-slate-500">Calculated from lesson runtimes.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Review state</p>
              <p className="mt-3 text-lg font-black text-amber-300">Pending content review</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Draft modules can be synced once video processing completes.</p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  refreshSections();
                  refreshLessons();
                }}
                className="rounded-2xl border-slate-700 bg-slate-900 py-4 text-slate-100 hover:bg-slate-800"
              >
                Save Draft
              </Button>
              <Button type="button" variant="primary" onClick={handlePublishToggle} isLoading={isPublishing} className="rounded-2xl py-4">
                {localPublished ? "Save & Sync for Students" : "Publish Course"}
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Live curriculum outline</h2>
            <p className="text-sm font-medium text-slate-500">Create sections and lessons below. The management card above previews the active builder mode.</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
            <Sparkles size={16} />
            <span>{lessonsLoading ? "Refreshing lesson totals..." : "Draft autosave ready"}</span>
          </div>
        </div>

        {(sectionsLoading || lessonsLoading) && (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-500">
            <Loader2 className="mx-auto mb-4 animate-spin" size={24} />
            <p className="text-sm font-bold">Loading editor details...</p>
          </div>
        )}

        {(sectionsError || lessonsError) && (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm font-bold text-red-600">
            {sectionsError || lessonsError}
          </div>
        )}

        <div className="space-y-6">
          <SectionList courseId={course.id} isInstructor sections={sections} onSectionsRefresh={refreshSections} />
        </div>
      </section>
    </div>
  );
}
