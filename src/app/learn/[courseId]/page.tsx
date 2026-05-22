"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, Play, ArrowRight } from "lucide-react";

import { useAuthContext } from "@/providers/AuthProvider";
import { useEnrollment } from "@/features/courses/hooks/useEnrollment";
import { supabase } from "@/lib/supabase-client";
import Spinner from "@/shared/components/Spinner";
import { Button } from "@/shared/ui/button";

interface LessonRecord {
  id: string;
  section_id: string;
  title: string;
  is_preview: boolean;
  video_url: string | null;
  position: number;
  description?: string | null;
}

interface SectionRecord {
  id: string;
  title: string;
  position?: number;
  lessons: LessonRecord[];
}

interface CourseRecord {
  id: string;
  title: string;
  description: string | null;
  price: number;
  published?: boolean;
  instructor_id: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function LearnCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const { profile, loading: authLoading } = useAuthContext();
  const { requestToJoin, loading: requestLoading } = useEnrollment();
  const [course, setCourse] = useState<CourseRecord | null>(null);
  const [sections, setSections] = useState<SectionRecord[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      setError(null);

      try {
        const [{ data: courseData, error: courseError }, { data: sectionsData, error: sectionsError }] = await Promise.all([
          supabase.from("courses").select("*").eq("id", courseId).single(),
          supabase.from("sections").select("*").eq("course_id", courseId).order("created_at", { ascending: true }),
        ]);

        if (courseError || !courseData) {
          setError("Course not found or is unavailable.");
          return;
        }

        if (sectionsError) {
          setError("Unable to load course structure at this time.");
          return;
        }

        const sectionIds = (sectionsData || []).map((section) => section.id).filter(Boolean);
        const { data: lessonData, error: lessonError } = sectionIds.length
          ? await supabase
              .from("lessons")
              .select("*")
              .in("section_id", sectionIds)
              .order("position", { ascending: true })
          : { data: [], error: null };

        if (lessonError) {
          setError("Unable to load course lessons at this time.");
          return;
        }

        setCourse(courseData as CourseRecord);

        const lessons = (lessonData || []) as LessonRecord[];
        const groupedSections = (sectionsData || []).map((section, index) => ({
          id: section.id,
          title: section.title,
          position: section.position ?? index + 1,
          lessons: lessons.filter((lessonItem) => lessonItem.section_id === section.id),
        }));

        setSections(groupedSections);

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
          setRequestStatus(requestData?.status ?? null);
        }
      } catch (loadError: unknown) {
        console.error(loadError);
        setError(getErrorMessage(loadError, "Unable to load course data."));
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId, profile]);

  const handleRequestAccess = async () => {
    if (!course) return;
    const success = await requestToJoin(course.id, course.instructor_id);
    if (success) {
      setRequestStatus("pending");
    }
  };

  if (loading || authLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Spinner />
        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">Loading learning experience...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-black text-slate-800">{error || "Unable to load this course."}</p>
          <Link href="/dashboard/courses" className="mt-4 inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100">
            Browse other courses
          </Link>
        </div>
      </div>
    );
  }

  const hasPreviewLessons = sections.some((section) => section.lessons.some((lesson) => lesson.is_preview));
  const firstLesson = sections
    .flatMap((section) => section.lessons)
    .sort((a, b) => a.position - b.position)[0];

  return (
    <div className="space-y-8">
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-violet-700">
              <BookOpen size={14} /> Learning preview
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{course.title}</h1>
              <p className="max-w-3xl text-sm text-slate-500">{course.description || "A student-facing course landing page with section navigation and preview content."}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[2rem] bg-slate-50 p-5 text-sm font-black uppercase tracking-[0.26em] text-slate-600">
              Price
              <p className="mt-3 text-2xl text-slate-900">{course.price ? `$${course.price}` : "Free"}</p>
            </div>
            <div className="rounded-[2rem] bg-slate-50 p-5 text-sm font-black uppercase tracking-[0.26em] text-slate-600">
              Status
              <p className="mt-3 text-2xl text-slate-900">{course.published ? "Live" : "Draft"}</p>
            </div>
            <div className="rounded-[2rem] bg-slate-50 p-5 text-sm font-black uppercase tracking-[0.26em] text-slate-600">
              Enrollment
              <p className="mt-3 text-2xl text-slate-900">{isEnrolled ? "Active" : requestStatus === "pending" ? "Pending" : "None"}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-slate-100">
            <p className="text-xs uppercase tracking-[0.28em] text-violet-400 font-black">Course preview</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {isEnrolled
                ? "You are enrolled and can access all unlocked lessons."
                : hasPreviewLessons
                ? "You can preview selected lessons before requesting access."
                : "Enrollment is required to access this course content."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isEnrolled ? (
              <Button variant="primary" className="flex items-center gap-2">
                <CheckCircle2 size={16} /> Continue learning
              </Button>
            ) : requestStatus === "pending" ? (
              <Button variant="secondary" disabled>
                <Clock size={16} /> Request pending
              </Button>
            ) : (
              <Button variant="primary" onClick={handleRequestAccess} isLoading={requestLoading}>
                <Play size={16} /> Request access
              </Button>
            )}

            {firstLesson ? (
              <Link href={`/learn/${course.id}/lesson/${firstLesson.id}`} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                <ArrowRight size={16} /> Start first lesson
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-bold text-slate-500">
                <ArrowRight size={16} /> No lessons yet
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          {sections.length === 0 ? (
            <div className="rounded-[2.5rem] border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
              <p className="font-black">No sections are available for this course yet.</p>
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.id} className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500 font-black">Section</p>
                    <h2 className="mt-2 text-xl font-black text-slate-900">{section.title}</h2>
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">{section.lessons.length} lessons</span>
                </div>

                <div className="mt-6 space-y-3">
                  {section.lessons.map((lesson) => {
                    const accessible = isEnrolled || lesson.is_preview;
                    return (
                      <div
                        key={lesson.id}
                        className={`rounded-3xl border p-5 transition ${accessible ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-slate-100/80 opacity-80"}`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-black text-slate-900">{lesson.title}</p>
                            {lesson.description ? <p className="text-sm text-slate-500 mt-1">{lesson.description}</p> : null}
                          </div>
                          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-slate-500">
                            {lesson.is_preview ? (
                              <span className="rounded-full bg-violet-100 px-3 py-1 text-violet-700">Preview</span>
                            ) : (
                              <span className="rounded-full bg-slate-100 px-3 py-1">Locked</span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          {accessible ? (
                            <Link href={`/learn/${course.id}/lesson/${lesson.id}`} className="text-sm font-black uppercase tracking-[0.28em] text-violet-600 hover:text-violet-700">
                              Open lesson
                            </Link>
                          ) : (
                            <span className="text-sm font-bold uppercase tracking-[0.28em] text-slate-400">Enroll to unlock</span>
                          )}

                          <div className="text-xs text-slate-400 flex items-center gap-2">
                            <Play size={14} /> Lesson {lesson.position}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-slate-950 p-6 text-slate-100 shadow-sm">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-violet-400 font-black">Need help?</p>
            <h2 className="text-xl font-black tracking-tight">Student access guide</h2>
            <p className="text-sm text-slate-400">If the course is locked, request access and continue through preview lessons while your enrollment is processed.</p>
          </div>
          <div className="rounded-[2rem] bg-slate-900 p-5 text-sm text-slate-400">
            <p className="font-black uppercase tracking-[0.28em] text-violet-400 mb-3">Preview notes</p>
            <p>Preview lessons are available even before enrollment. Access fully unlocked lessons once the instructor approves your request.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
