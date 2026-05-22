"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Play, Video, CheckCircle2, BookOpen, AlertCircle } from "lucide-react";

import { useAuthContext } from "@/providers/AuthProvider";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { supabase } from "@/lib/supabase-client";
import Spinner from "@/shared/components/Spinner";
import { Button } from "@/shared/ui/button";
import VideoPlayer from "@/features/video/components/VideoPlayer";
import CurriculumSidebar from "@/features/lessons/components/CurriculumSidebar";
import { Section } from "@/features/sections/types/section.types";

interface LessonRecord {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  is_preview: boolean;
  position: number;
}

interface SectionRecord extends Section {
  lessons: LessonRecord[];
}

interface CourseRecord {
  id: string;
  title: string;
  instructor_id: string;
  published?: boolean;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function LearnLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = use(params);
  const { profile, loading: authLoading } = useAuthContext();
  const [course, setCourse] = useState<CourseRecord | null>(null);
  const [sections, setSections] = useState<SectionRecord[]>([]);
  const [lesson, setLesson] = useState<LessonRecord | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLesson = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load course and sections in parallel
        const [{ data: courseData, error: courseError }, { data: sectionsData, error: sectionsError }] = 
          await Promise.all([
            supabase.from("courses").select("id, title, instructor_id, published").eq("id", courseId).single(),
            supabase.from("sections").select("*").eq("course_id", courseId).order("position", { ascending: true }),
          ]);

        if (courseError || !courseData) {
          setError("Course not found or is unavailable.");
          return;
        }

        if (sectionsError) {
          setError("Unable to load course structure.");
          return;
        }

        // Load all lessons for this course
        const sectionIds = (sectionsData || []).map((s) => s.id).filter(Boolean);
        const { data: allLessonsData, error: lessonsError } = sectionIds.length
          ? await supabase
              .from("lessons")
              .select("*")
              .in("section_id", sectionIds)
              .order("position", { ascending: true })
          : { data: [], error: null };

        if (lessonsError) {
          setError("Unable to load lessons.");
          return;
        }

        // Verify current lesson exists in this course
        const currentLesson = allLessonsData?.find((l) => l.id === lessonId);
        if (!currentLesson) {
          setError("Lesson not found in this course.");
          return;
        }

        setCourse(courseData as CourseRecord);
        setLesson(currentLesson as LessonRecord);

        // Group lessons by section
        const groupedSections = (sectionsData || []).map((section) => ({
          ...section,
          lessons: (allLessonsData || [])
            .filter((lesson) => lesson.section_id === section.id)
            .sort((a, b) => a.position - b.position) as LessonRecord[],
        })) as SectionRecord[];

        setSections(groupedSections);

        // Check enrollment status
        if (profile) {
          const [{ data: enrollmentData }, { data: requestData }] = await Promise.all([
            supabase
              .from("enrollments")
              .select("id")
              .eq("course_id", courseId)
              .eq("user_id", profile.id)
              .single(),
            supabase
              .from("enrollment_requests")
              .select("status")
              .eq("course_id", courseId)
              .eq("student_id", profile.id)
              .maybeSingle(),
          ]);

          setIsEnrolled(Boolean(enrollmentData || requestData?.status === "approved"));
        }
      } catch (loadError: unknown) {
        console.error(loadError);
        setError(getErrorMessage(loadError, "Unable to load lesson content."));
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [courseId, lessonId, profile]);

  const canAccessLesson = Boolean(isEnrolled || lesson?.is_preview);
  const { completedLessonIds, toggleLesson, loading: progressLoading, summary } = profile 
    ? useProgress(profile.id, courseId) 
    : { completedLessonIds: [] as string[], toggleLesson: async () => {}, loading: false, summary: null };

  const isLessonCompleted = lesson ? completedLessonIds.includes(lesson.id) : false;

  if (loading || authLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Spinner />
        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">Loading lesson...</p>
      </div>
    );
  }

  if (error || !course || !lesson) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <AlertCircle size={40} className="mx-auto text-slate-300 mb-4" />
          <p className="text-sm font-black text-slate-800 mb-2">{error || "Lesson not found"}</p>
          <p className="text-xs text-slate-500 mb-6">The lesson you're looking for may have been removed or you don't have access.</p>
          <Link 
            href={`/learn/${courseId}`} 
            className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft size={14} className="mr-2" /> Return to course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Link 
            href={`/learn/${course.id}`} 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.32em] text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft size={14} /> Back to course overview
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-violet-600 font-black">{course.title}</p>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">{lesson.title}</h1>
          </div>
        </div>

        {canAccessLesson && (
          <button
            onClick={() => profile && toggleLesson(lesson.id, isLessonCompleted)}
            disabled={progressLoading || !profile}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-[0.28em] transition ${
              isLessonCompleted
                ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
                : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 size={14} />
            {isLessonCompleted ? "Completed" : "Mark complete"}
          </button>
        )}
      </div>

      {/* Main Content with Sidebar */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Video & Description */}
        <div className="lg:col-span-2 space-y-6">
          {canAccessLesson ? (
            <>
              <div className="rounded-[2.5rem] border border-slate-200 bg-white overflow-hidden shadow-sm">
                <VideoPlayer url={lesson.video_url} />
              </div>

              {/* Lesson Details */}
              <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
                  <BookOpen size={18} className="text-violet-600" />
                  <h2 className="font-black text-slate-900">About this lesson</h2>
                </div>
                
                {lesson.description ? (
                  <p className="text-sm leading-relaxed text-slate-600">{lesson.description}</p>
                ) : (
                  <p className="text-sm text-slate-500 italic">No description provided for this lesson.</p>
                )}

                {lesson.is_preview && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex gap-3 mt-6">
                    <Play size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-amber-900 uppercase tracking-wider">Preview lesson</p>
                      <p className="text-xs text-amber-700 mt-1">This lesson is available for preview. Enroll to access the full course.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Summary */}
              {summary && (
                <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-slate-900">Course progress</h3>
                    <span className="text-2xl font-black text-violet-600">{summary.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${summary.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    {summary.completedLessons} of {summary.totalLessons} lessons completed
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Lock size={40} className="mx-auto text-slate-300 mb-4" />
              <h2 className="text-2xl font-black text-slate-900 mb-2">This lesson is locked</h2>
              <p className="text-sm text-slate-500 mb-6">Enroll in the course to access all lessons and track your progress.</p>
              <Link 
                href={`/learn/${course.id}`}
                className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-violet-700"
              >
                View enrollment options
              </Link>
            </div>
          )}
        </div>

        {/* Curriculum Sidebar */}
        <div className="lg:col-span-1">
          <CurriculumSidebar
            courseId={courseId}
            currentLessonId={lessonId}
            sections={sections}
            lessons={sections.flatMap((s) => s.lessons)}
            completedLessonIds={completedLessonIds}
            isEnrolled={isEnrolled}
            isPreview={false}
          />
        </div>
      </div>
    </div>
  );
}
