"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";
import { progressService } from "@/features/progress/services/progress.service";
import DashboardHeader from "@/shared/components/dashboard/DashboardHeader";
import StatCard from "@/shared/components/dashboard/StatCard";
import CourseCard from "@/shared/components/dashboard/CourseCard";
import AnalyticsCard from "@/shared/components/dashboard/AnalyticsCard";
import Spinner from "@/shared/components/Spinner";
import { BookOpen, Trophy, Sparkles, Clock, Activity } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description?: string;
}

interface EnrollmentRecord {
  id: string;
  course_id: string;
  created_at: string;
  courses?: Course;
  progressSummary?: {
    percentage: number;
    completedLessons: number;
    totalLessons: number;
  };
}

interface EnrollmentRow {
  id: string;
  course_id: string | null;
  created_at: string;
}

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudentDashboard = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const userId = session.user.id;

        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from("enrollments")
          .select("id, course_id, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (enrollmentError) throw enrollmentError;

        const courseIds = Array.from(
          new Set(
            ((enrollmentData || []) as EnrollmentRow[])
              .map((item) => item.course_id)
              .filter((id): id is string => Boolean(id))
          )
        );

        const { data: coursesData, error: coursesError } = courseIds.length
          ? await supabase
              .from("courses")
              .select("id, title, description")
              .in("id", courseIds)
          : { data: [], error: null };

        if (coursesError) throw coursesError;

        const courseMap = Object.fromEntries(
          (coursesData || []).map((course) => [course.id, course])
        );

        const enrichedEnrollments: EnrollmentRecord[] = ((enrollmentData || []) as EnrollmentRow[])
          .filter((enrollment): enrollment is EnrollmentRow & { course_id: string } =>
            Boolean(enrollment.course_id)
          )
          .map((enrollment) => ({
            ...enrollment,
            courses: courseMap[enrollment.course_id],
          }));

        const progressSummaries = await Promise.all(
          enrichedEnrollments.map(async (enrollment) => {
            try {
              return await progressService.getCourseProgressSummary(
                userId,
                enrollment.course_id
              );
            } catch {
              return {
                percentage: 0,
                completedLessons: 0,
                totalLessons: 0,
              };
            }
          })
        );

        setEnrollments(
          enrichedEnrollments.map((enrollment, index) => ({
            ...enrollment,
            progressSummary: progressSummaries[index],
          }))
        );
      } catch (err) {
        console.error("Failed to load student dashboard:", err);
        setError("Unable to load your learning dashboard right now.");
      } finally {
        setLoading(false);
      }
    };

    loadStudentDashboard();
  }, []);

  const certificatesEarned = useMemo(
    () => enrollments.filter((item) => item.progressSummary?.percentage === 100).length,
    [enrollments]
  );

  const totalCompletedLessons = useMemo(
    () =>
      enrollments.reduce(
        (sum, enrollment) => sum + (enrollment.progressSummary?.completedLessons || 0),
        0
      ),
    [enrollments]
  );

  const averageProgress = useMemo(() => {
    if (enrollments.length === 0) return 0;
    const total = enrollments.reduce(
      (sum, enrollment) => sum + (enrollment.progressSummary?.percentage || 0),
      0
    );
    return Math.round(total / enrollments.length);
  }, [enrollments]);

  const recentActivity = useMemo(
    () =>
      enrollments.slice(0, 3).map((enrollment) => ({
        id: enrollment.id,
        title: enrollment.courses?.title || "Learning path",
        description: enrollment.courses?.description || "Continue the next lesson in your course.",
        progress: enrollment.progressSummary?.percentage || 0,
      })),
    [enrollments]
  );

  if (loading) {
    return (
      <div className="h-[60vh] w-full flex flex-col items-center justify-center">
        <Spinner />
        <p className="text-xs font-bold text-slate-400 mt-3 tracking-wider uppercase">Loading your learning workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700 shadow-sm">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto px-2">
      <DashboardHeader
        title="Learning Home"
        subtitle="A calm workspace built to help you stay focused on your next lesson, certificates, and progress milestones."
        badge="Student workspace"
        ctaLabel="Browse catalog"
        ctaHref="/courses"
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Enrolled courses"
          value={enrollments.length}
          description="Courses you are currently progressing through."
          icon={BookOpen}
          accent="violet"
        />
        <StatCard
          label="Completion"
          value={`${averageProgress}%`}
          description="Average course progress across your active tracks."
          icon={Sparkles}
          accent="emerald"
        />
        <StatCard
          label="Lessons finished"
          value={totalCompletedLessons}
          description="Total lessons completed across enrolled courses."
          icon={Clock}
          accent="sky"
        />
        <StatCard
          label="Certificates"
          value={certificatesEarned}
          description="Certificates earned from completed courses."
          icon={Trophy}
          accent="amber"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
        <section className="space-y-6">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400 font-black">Keep moving forward</p>
                <h2 className="mt-3 text-2xl font-black text-slate-900">Continue your most recent learning paths</h2>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Explore more courses
              </Link>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400 font-black">Active courses</p>
                <h3 className="mt-2 text-xl font-black text-slate-900">Your current curriculum</h3>
              </div>
              <span className="rounded-full bg-violet-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.24em] text-violet-700">
                {enrollments.length} active
              </span>
            </div>

            {enrollments.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
                No active enrollments yet. Pick a course to begin your learning journey.
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <CourseCard
                    key={enrollment.id}
                    title={enrollment.courses?.title || "Untitled course"}
                    description={enrollment.courses?.description || "Continue your progress with the next lesson."}
                    progress={enrollment.progressSummary?.percentage || 0}
                    metricLabel="Progress"
                    metricValue={`${enrollment.progressSummary?.percentage || 0}%`}
                    href={`/courses/${enrollment.course_id}`}
                    badge="Learning track"
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400 font-black">Weekly insights</p>
                <h3 className="mt-2 text-xl font-black text-slate-900">Your learning pulse</h3>
              </div>
              <Sparkles size={20} className="text-violet-500" />
            </div>

            <div className="mt-6 space-y-4">
              <AnalyticsCard
                label="Certificates"
                value={`${certificatesEarned}`}
                meta="Earned by completing courses."
                icon={Trophy}
                accent="emerald"
              />
              <AnalyticsCard
                label="Active courses"
                value={`${enrollments.length}`}
                meta="Courses currently in your learning queue."
                icon={BookOpen}
                accent="sky"
              />
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400 font-black">Activity feed</p>
                <h3 className="mt-2 text-xl font-black text-slate-900">Recent learning</h3>
              </div>
              <Activity size={20} className="text-sky-500" />
            </div>

            <div className="mt-6 space-y-4">
              {recentActivity.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-500">Your recent learning activity will appear here once you start a course.</div>
              ) : (
                recentActivity.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.progress}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
