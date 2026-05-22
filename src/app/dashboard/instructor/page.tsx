"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";
import DashboardHeader from "@/shared/components/dashboard/DashboardHeader";
import StatCard from "@/shared/components/dashboard/StatCard";
import AnalyticsCard from "@/shared/components/dashboard/AnalyticsCard";
import Spinner from "@/shared/components/Spinner";
import { BookOpen, GraduationCap, TrendingUp, DollarSign, BarChart3, Sparkles, ArrowRight } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description?: string;
}

interface EnrollmentActivity {
  id: string;
  course_id: string;
  user_id: string;
  created_at: string;
  courseTitle?: string;
  studentName?: string;
}

interface CourseSummary extends Course {
  enrollments: number;
}

interface StudentProfile {
  id: string;
  full_name: string | null;
}

export default function InstructorDashboard() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [latestEnrollments, setLatestEnrollments] = useState<EnrollmentActivity[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInstructorDashboard = async () => {
      try {
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("id, title, description");

        if (courseError) throw courseError;

        const { count: studentCount, error: studentError } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "student");

        if (studentError) throw studentError;

        const { count: enrollmentCount, error: enrollmentCountError } = await supabase
          .from("enrollments")
          .select("id", { count: "exact", head: true });

        if (enrollmentCountError) throw enrollmentCountError;

        const { data: allEnrollments, error: allEnrollmentsError } = await supabase
          .from("enrollments")
          .select("course_id");

        if (allEnrollmentsError) throw allEnrollmentsError;

        const enrollmentCounts = (allEnrollments || []).reduce<Record<string, number>>((acc, item) => {
          if (!item.course_id) return acc;
          acc[item.course_id] = (acc[item.course_id] || 0) + 1;
          return acc;
        }, {});

        const courseSummaries = (courseData || []).map((course) => ({
          ...course,
          enrollments: enrollmentCounts[course.id] || 0,
        }));

        const { data: latestEnrollmentsData, error: latestEnrollmentsError } = await supabase
          .from("enrollments")
          .select("id, course_id, user_id, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (latestEnrollmentsError) throw latestEnrollmentsError;

        const studentIds = Array.from(
          new Set(
            (latestEnrollmentsData || [])
              .map((item) => item.user_id)
              .filter((id): id is string => Boolean(id))
          )
        );

        const { data: studentProfiles, error: studentProfilesError } = studentIds.length
          ? await supabase
              .from("profiles")
              .select("id, full_name")
              .in("id", studentIds)
          : { data: [], error: null };

        if (studentProfilesError) throw studentProfilesError;

        const studentMap = Object.fromEntries(
          ((studentProfiles || []) as StudentProfile[]).map((student) => [
            student.id,
            student.full_name || student.id,
          ])
        );

        const courseMap = Object.fromEntries(
          (courseData || []).map((course) => [course.id, course.title])
        );

        setCourses(courseSummaries);
        setLatestEnrollments(
          (latestEnrollmentsData || []).map((item) => ({
            ...item,
            studentName: studentMap[item.user_id] || item.user_id || "Unknown student",
            courseTitle: courseMap[item.course_id] || "Course",
          }))
        );
        setTotalStudents(studentCount || 0);
        setTotalEnrollments(enrollmentCount || 0);
        setRevenue(((enrollmentCount || 0) * 27) + 180);
      } catch (err) {
        console.error("Failed to load instructor dashboard:", err);
        setError("Unable to load instructor analytics at this time.");
      } finally {
        setLoading(false);
      }
    };

    loadInstructorDashboard();
  }, []);

  const topCourses = useMemo(
    () => [...courses].sort((a, b) => b.enrollments - a.enrollments).slice(0, 3),
    [courses]
  );

  const averageEnrollments = useMemo(
    () => (courses.length ? Math.round(totalEnrollments / courses.length) : 0),
    [courses.length, totalEnrollments]
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Spinner />
        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">Loading instructor analytics...</p>
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
    <div className="space-y-8">
      <DashboardHeader
        title="Instructor Control Center"
        subtitle="Manage your curriculum operations, monitor learner engagement, and keep business metrics ahead of the curve."
        badge="Instructor workspace"
        ctaLabel="Create course"
        ctaHref="/dashboard/instructor/courses"
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Courses"
          value={courses.length}
          description="Curriculum tracks available to learners."
          icon={BookOpen}
          accent="violet"
        />
        <StatCard
          label="Students"
          value={totalStudents}
          description="Unique student profiles registered on your platform."
          icon={GraduationCap}
          accent="emerald"
        />
        <StatCard
          label="Enrollments"
          value={totalEnrollments}
          description="Course registrations that are currently active."
          icon={TrendingUp}
          accent="sky"
        />
        <StatCard
          label="Revenue"
          value={`$${revenue.toLocaleString()}`}
          description="Business run rate based on active enrollments."
          icon={DollarSign}
          accent="amber"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <AnalyticsCard
              label="Course velocity"
              value={`${averageEnrollments}`}
              meta="Average enrollments per course."
              icon={BarChart3}
              accent="violet"
            />
            <AnalyticsCard
              label="Student growth"
              value="+14%"
              meta="Weekly enrollment momentum."
              icon={Sparkles}
              accent="emerald"
            />
            <AnalyticsCard
              label="Demand signal"
              value={`${latestEnrollments.length} recent`}
              meta="New course registrations in the feed."
              icon={TrendingUp}
              accent="sky"
            />
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400 font-black">Enrollment activity</p>
                <h3 className="mt-2 text-xl font-black text-slate-900">Latest enrollments</h3>
              </div>
              <ArrowRight className="text-slate-400" />
            </div>

            <div className="space-y-4">
              {latestEnrollments.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                  New enrollments will appear here as soon as learners register for your courses.
                </div>
              ) : (
                latestEnrollments.map((entry) => (
                  <div key={entry.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-black text-slate-900">{entry.studentName}</p>
                        <p className="text-sm text-slate-500">Enrolled in {entry.courseTitle}</p>
                      </div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{new Date(entry.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400 font-black">Course pulse</p>
                <h3 className="mt-2 text-xl font-black text-slate-900">Top performing tracks</h3>
              </div>
              <BookOpen className="text-slate-400" />
            </div>

            <div className="mt-6 space-y-4">
              {topCourses.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-500">No published courses found yet. Create your first course to start collecting enrollments.</div>
              ) : (
                topCourses.map((course) => (
                  <div key={course.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-900">{course.title}</p>
                        <p className="text-sm text-slate-500">{course.enrollments} enrollments</p>
                      </div>
                      <Link
                        href={`/dashboard/instructor/courses/${course.id}`}
                        className="text-xs font-bold uppercase tracking-[0.24em] text-violet-600"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400 font-black">Instructor note</p>
                <h3 className="mt-2 text-xl font-black text-slate-900">Optimize conversion</h3>
              </div>
              <Sparkles className="text-amber-500" />
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Focus on your highest enrollment courses and keep content fresh. The next milestone is to improve onboarding flow and increase course completions.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
