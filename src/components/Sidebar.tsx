"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  GraduationCap,
  BarChart3,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-72 min-h-screen bg-white border-r border-gray-200 flex-col justify-between">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              S
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Sherry LMS
              </h1>

              <p className="text-xs text-gray-400">
                Learning Platform
              </p>
            </div>

          </div>
        </div>

        {/* MENU */}
        <div className="px-5 py-6">

          <p className="text-xs uppercase tracking-wider text-gray-400 mb-4 px-3">
            Main Menu
          </p>

          <nav className="space-y-2">

            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-violet-50 text-violet-700 font-medium shadow-sm"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>

            <Link
              href="/dashboard/courses"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-100 transition"
            >
              <BookOpen size={20} />
              Courses
            </Link>

            <Link
              href="/dashboard/students"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-100 transition"
            >
              <GraduationCap size={20} />
              Students
            </Link>

            <Link
              href="/dashboard/users"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-100 transition"
            >
              <Users size={20} />
              Users
            </Link>

            <Link
              href="/dashboard/analytics"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-100 transition"
            >
              <BarChart3 size={20} />
              Analytics
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-100 transition"
            >
              <Settings size={20} />
              Settings
            </Link>

          </nav>
        </div>
      </div>

      {/* BOTTOM CARD */}
      <div className="p-5">

        <div className="rounded-3xl bg-gradient-to-r from-cyan-400 to-blue-500 p-6 text-white shadow-xl">

          <h3 className="font-semibold text-lg leading-snug">
            Upgrade your LMS Experience
          </h3>

          <p className="text-sm mt-2 text-cyan-50">
            Build modern learning systems with Next.js & Supabase.
          </p>

          <button className="mt-5 w-full bg-white text-blue-600 font-medium py-2 rounded-xl hover:bg-gray-100 transition">
            Explore
          </button>

        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center text-xs text-gray-400">
          © 2026 Sherry LMS
        </div>

      </div>

    </aside>
  );
}