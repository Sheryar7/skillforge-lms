"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-client";

import {
  DollarSign,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Activity,
} from "lucide-react";

interface Profile {
  id: string;
  role: string;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  price?: number;
  created_at: string;
}

interface Enrollment {
  id: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
  courses?: {
    title: string;
  };
}

export default function AnalyticsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // PROFILES
      const { data: profilesData, error: profilesError } =
        await supabase
          .from("profiles")
          .select("*");

      if (profilesError) throw profilesError;

      // COURSES
      const { data: coursesData, error: coursesError } =
        await supabase
          .from("courses")
          .select("*");

      if (coursesError) throw coursesError;

      // ENROLLMENTS
      const { data: enrollmentsData, error: enrollmentsError } =
        await supabase
          .from("enrollments")
          .select(`
            *,
            profiles(full_name,email),
            courses(title)
          `)
          .order("created_at", { ascending: false });

      if (enrollmentsError) throw enrollmentsError;

      setProfiles(profilesData || []);
      setCourses(coursesData || []);
      setEnrollments(enrollmentsData || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics dashboard.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CALCULATIONS
  // =========================

  const totalStudents = useMemo(() => {
    return profiles.filter(
      (p) => p.role?.toLowerCase() === "student"
    ).length;
  }, [profiles]);

  const totalInstructors = useMemo(() => {
    return profiles.filter(
      (p) => p.role?.toLowerCase() === "instructor"
    ).length;
  }, [profiles]);

  const totalCourses = courses.length;

  const totalEnrollments = enrollments.length;

  // MOCK REVENUE LOGIC
  const totalRevenue = useMemo(() => {
    return courses.reduce((acc, course) => {
      return acc + (course.price || 0);
    }, 0);
  }, [courses]);

  // RECENT USERS THIS WEEK
  const weeklyGrowth = useMemo(() => {
    const now = new Date();

    const lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);

    return profiles.filter(
      (profile) =>
        new Date(profile.created_at) >= lastWeek
    ).length;
  }, [profiles]);

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-700",
      subtext: "Platform earnings",
    },

    {
      title: "Students",
      value: totalStudents,
      icon: GraduationCap,
      color: "bg-blue-100 text-blue-700",
      subtext: "Registered learners",
    },

    {
      title: "Instructors",
      value: totalInstructors,
      icon: Users,
      color: "bg-violet-100 text-violet-700",
      subtext: "Teaching staff",
    },

    {
      title: "Courses",
      value: totalCourses,
      icon: BookOpen,
      color: "bg-orange-100 text-orange-700",
      subtext: "Published courses",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            LMS Analytics
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor platform growth, student engagement,
            enrollment activity, and overall business performance.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <TrendingUp size={20} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Weekly Growth
              </p>

              <h3 className="text-xl font-bold text-slate-900">
                +{weeklyGrowth}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-20 text-center text-sm text-slate-500 shadow-sm">
          Loading analytics dashboard...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* STATS */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </h2>

                    <p className="mt-2 text-xs text-slate-400">
                      {stat.subtext}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <stat.icon size={22} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="grid gap-6 xl:grid-cols-3">
            {/* ENROLLMENT ACTIVITY */}
            <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Activity size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Recent Enrollments
                    </h3>

                    <p className="text-sm text-slate-500">
                      Latest student enrollment activity
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {enrollments.length === 0 ? (
                  <div className="p-12 text-center text-sm text-slate-500">
                    No enrollment activity yet.
                  </div>
                ) : (
                  enrollments.slice(0, 8).map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between p-5 transition hover:bg-slate-50"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {enrollment.profiles?.full_name ||
                            "Unknown Student"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Enrolled in{" "}
                          <span className="font-medium">
                            {enrollment.courses?.title ||
                              "Untitled Course"}
                          </span>
                        </p>
                      </div>

                      <div className="text-xs text-slate-400">
                        {new Date(
                          enrollment.created_at
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* PLATFORM OVERVIEW */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <h3 className="font-semibold text-slate-900">
                  Platform Overview
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Real-time LMS infrastructure statistics
                </p>
              </div>

              <div className="space-y-6 p-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      Enrollment Volume
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {totalEnrollments}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{
                        width: `${Math.min(
                          totalEnrollments * 10,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      Student Activity
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {totalStudents}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${Math.min(
                          totalStudents * 5,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      Course Publishing
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {totalCourses}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{
                        width: `${Math.min(
                          totalCourses * 10,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      Instructor Presence
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {totalInstructors}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${Math.min(
                          totalInstructors * 15,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}