"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client"; 

import {
  ArrowRight,
  PlayCircle,
  Star,
  ShieldCheck,
  BarChart3,
  BookOpen,
  Users,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  MonitorPlay,
  Layers3,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check user session status on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    // FIXED: Handled parameters correctly without triggering implicit any or invalid string assignments
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Premium Course Builder",
      description: "Create structured courses with sections, lessons, videos, and modern learning workflows.",
    },
    {
      icon: MonitorPlay,
      title: "Interactive Video Learning",
      description: "Deliver immersive learning experiences with progress tracking and lesson completion.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track enrollments, revenue, completion rates, and learner engagement in real time.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Authentication",
      description: "Enterprise-grade authentication powered with Supabase and protected user sessions.",
    },
    {
      icon: Users,
      title: "Student Management",
      description: "Manage thousands of students, monitor progress, and organize learning efficiently.",
    },
    {
      icon: Layers3,
      title: "Scalable SaaS Architecture",
      description: "Built with Next.js, TypeScript, Tailwind CSS, and Supabase for high scalability.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Students" },
    { value: "250+", label: "Courses" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "Ratings" },
  ];

  const benefits = [
    "Modern Instructor Dashboard",
    "Course Progress Tracking",
    "Authentication & Security",
    "Responsive SaaS Experience",
    "Analytics & Insights",
    "Professional UI/UX",
  ];

  return (
    <main className="relative overflow-hidden">
      {/* Native Favicon Head Fallback Injection */}
      <title>Sherry LMS - Modern SaaS Learning Platform</title>
      <link rel="icon" href="/favicon.ico" sizes="any" />

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-5 py-2 text-sm font-semibold text-violet-700 shadow-sm">
              <Sparkles size={16} />
              Modern SaaS Learning Platform
            </div>

            {/* TITLE */}
            <h1 className="mt-8 text-5xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl xl:text-7xl">
              Build &{" "}
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                Scale
              </span>
              <br />
              Your Modern LMS
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-700 font-medium">
              Sherry LMS is a modern SaaS learning management platform
              built with Next.js and Supabase. Create courses, manage
              students, track analytics, and deliver immersive learning
              experiences.
            </p>

            {/* CONDITIONAL HERO BUTTONS */}
            {!loading && (
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                {user ? (
                  // If logged in: Show one clear path to dashboard
                  <Link
                    href="/dashboard"
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-8 text-base font-semibold !text-white shadow-2xl shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
                  >
                    Go to Dashboard
                    <ArrowRight size={18} />
                  </Link>
                ) : (
                  // If logged out: Show Start Trial (Navigates to Register) & Explore
                  <>
                    <Link
                      href="/signup"
                      className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-8 text-base font-semibold !text-white shadow-2xl shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
                    >
                      Start Free Trial
                      <ArrowRight size={18} />
                    </Link>

                    <Link
                      href="/courses"
                      className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-8 text-base font-bold !text-slate-900 shadow-sm transition hover:bg-slate-100 !hover:text-violet-700"
                    >
                      Explore Courses
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* BENEFITS */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                  <span className="text-sm font-semibold text-slate-800">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT HERO CARD CONTAINER */}
          <div className="flex flex-col gap-6">
            {/* MAIN CARD */}
            <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white p-8 shadow-[0_20px_80px_rgba(15,23,42,0.06)]">
              {/* TOP */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Active Course</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    Full Stack LMS Development
                  </h3>
                </div>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-200">
                  <GraduationCap size={30} />
                </div>
              </div>

              {/* PROGRESS */}
              <div className="mt-10">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Course Progress</span>
                  <span className="text-sm font-bold text-violet-600">82%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-violet-600 to-blue-600" />
                </div>
              </div>

              {/* STATS */}
              <div className="mt-10 grid grid-cols-2 gap-5">
                <div className="rounded-3xl bg-slate-50 p-6 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Users size={18} />
                    <span className="text-sm font-semibold">Students</span>
                  </div>
                  <h4 className="mt-4 text-3xl font-black text-slate-900">12.5K</h4>
                </div>
                <div className="rounded-3xl bg-slate-50 p-6 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Globe size={18} />
                    <span className="text-sm font-semibold">Worldwide</span>
                  </div>
                  <h4 className="mt-4 text-3xl font-black text-slate-900">85+</h4>
                </div>
              </div>

              {/* CURRENT LESSON */}
              <div className="mt-8 rounded-3xl border border-slate-200 p-5 bg-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Current Lesson</p>
                    <p className="mt-1 text-sm text-slate-600 font-medium">
                      Advanced Next.js Authentication
                    </p>
                  </div>
                  <button className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white shadow-xl shadow-violet-200 transition hover:bg-violet-700">
                    <PlayCircle size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* CUSTOMER SATISFACTION */}
            <div className="self-start rounded-3xl border border-slate-200 bg-white p-5 shadow-lg max-w-xs">
              <p className="text-sm font-semibold text-slate-500">Customer Satisfaction</p>
              <h3 className="mt-1 text-3xl font-black text-slate-900">4.9</h3>
              <div className="mt-2 flex items-center gap-1 text-yellow-400">
                <Star className="fill-yellow-400" size={16} />
                <Star className="fill-yellow-400" size={16} />
                <Star className="fill-yellow-400" size={16} />
                <Star className="fill-yellow-400" size={16} />
                <Star className="fill-yellow-400" size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="border-y border-slate-200 bg-white/70 py-20 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="text-5xl font-black text-violet-600">{stat.value}</h3>
              <p className="mt-3 text-sm font-semibold text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              <Sparkles size={16} />
              SaaS Features
            </div>
            <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Everything You Need To Run a <span className="text-violet-600">Modern LMS</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700 font-medium">
              A professional SaaS platform for instructors, students, and organizations with scalable architecture and modern design.
            </p>
          </div>

          <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                  <feature.icon size={30} />
                </div>
                <h3 className="mt-8 text-2xl font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-4 leading-8 text-slate-600 font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-violet-600 via-violet-700 to-blue-600 p-12 shadow-[0_30px_100px_rgba(124,58,237,0.35)] md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_30%)]" />

            <div className="relative max-w-3xl">
              <h2 className="text-4xl font-black leading-tight text-white md:text-5xl">
                Ready To Build Your Modern LMS Platform?
              </h2>
              <p className="mt-6 text-lg leading-8 text-violet-50 font-medium">
                Create courses, manage students, track analytics, and scale your learning business using Sherry LMS.
              </p>

              {/* CONDITIONAL CTA BUTTONS */}
              {!loading && (
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  {user ? (
                    // If logged in: Go to Dashboard
                    <Link
                      href="/dashboard"
                      className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-base font-extrabold !text-violet-700 transition hover:bg-slate-100 hover:scale-[1.02] !hover:text-violet-900"
                    >
                      Go to Dashboard
                      <ArrowRight size={18} />
                    </Link>
                  ) : (
                    // If logged out: Get Started (Navigates to signup folder) & Login
                    <>
                      <Link
                        href="/signup"
                        className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-base font-extrabold !text-violet-700 transition hover:bg-slate-100 hover:scale-[1.02] !hover:text-violet-900"
                      >
                        Get Started
                        <ArrowRight size={18} />
                      </Link>

                      <Link
                        href="/login"
                        className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/20 px-8 text-base font-bold !text-white transition hover:bg-white/10"
                      >
                        Login
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 md:flex-row">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Sherry LMS</h3>
            <p className="mt-1 text-sm text-slate-500">Modern SaaS Learning Platform</p>
          </div>
          <p className="text-sm text-slate-500">© 2026 Sherry LMS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}