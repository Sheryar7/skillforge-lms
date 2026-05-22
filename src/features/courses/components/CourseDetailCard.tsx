"use client";

import Image from "next/image";
import { BookOpen, Users, Clock, Award, BarChart3 } from "lucide-react";
import { Course } from "../types/course.types";

interface CourseDetailCardProps {
  course: Course;
  sectionCount?: number;
  lessonCount?: number;
  enrollmentCount?: number;
  children?: React.ReactNode;
}

export default function CourseDetailCard({
  course,
  sectionCount = 0,
  lessonCount = 0,
  enrollmentCount = 0,
  children,
}: CourseDetailCardProps) {
  const priceLabel = course.price === 0 ? "Free" : `$${course.price}`;
  const isPublished = course.published || course.status === "published";

  return (
    <div className="rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header with thumbnail */}
      <div className="relative h-64 lg:h-72 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-slate-50">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-100">
                <BookOpen size={32} className="text-violet-600" />
              </div>
              <p className="mt-4 text-sm font-bold text-slate-400">Course Thumbnail</p>
            </div>
          </div>
        )}

        {/* Overlay with course title and price */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-8">
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-4">
            {course.title || "Untitled Course"}
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black uppercase tracking-[0.24em] ${
                isPublished
                  ? "bg-green-500/90 text-white"
                  : "bg-amber-500/90 text-white"
              }`}>
                {isPublished ? "Published" : "Draft"}
              </span>
              <span className="inline-flex px-4 py-2 rounded-full text-sm font-black text-white bg-slate-900">
                {priceLabel}
              </span>
            </div>
            {course.level && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black text-white bg-violet-600">
                <Award size={14} /> {course.level}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Description */}
        <div className="space-y-3">
          <p className="text-sm text-slate-600 leading-relaxed">
            {course.description || "No description provided for this course yet."}
          </p>
          {course.category && (
            <div className="inline-block">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 px-3 py-1 bg-slate-100 rounded-full">
                {course.category}
              </span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 mb-2 mx-auto">
              <BookOpen size={16} className="text-violet-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{lessonCount}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Lessons</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 mb-2 mx-auto">
              <BarChart3 size={16} className="text-slate-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{sectionCount}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Sections</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 mb-2 mx-auto">
              <Users size={16} className="text-green-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{enrollmentCount}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Enrolled</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 mb-2 mx-auto">
              <Clock size={16} className="text-orange-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">-</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Duration</p>
          </div>
        </div>

        {/* Children content (actions, etc) */}
        {children && (
          <div className="border-t border-slate-200 pt-8">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
