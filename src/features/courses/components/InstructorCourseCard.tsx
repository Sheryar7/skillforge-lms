"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, BookOpen, Users, BarChart3, Lock, Eye } from "lucide-react";
import { Course } from "../types/course.types";

interface InstructorCourseCardProps {
  course: Course;
  lessonCount?: number;
  enrollmentCount?: number;
}

export default function InstructorCourseCard({ 
  course,
  lessonCount = 0,
  enrollmentCount = 0
}: InstructorCourseCardProps) {
  const priceLabel = course.price === 0 ? "Free" : `$${course.price}`;
  const isPublished = course.published || course.status === "published";

  return (
    <div className="group relative bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-slate-300">
      {/* Thumbnail */}
      <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-slate-50">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-100">
                <BookOpen size={24} className="text-violet-600" />
              </div>
              <p className="text-xs font-bold text-slate-400">No thumbnail</p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.24em] ${
            isPublished
              ? "bg-green-500/20 text-green-700 border border-green-500/30"
              : "bg-amber-500/20 text-amber-700 border border-amber-500/30"
          }`}>
            {isPublished ? (
              <>
                <Eye size={12} /> Published
              </>
            ) : (
              <>
                <Lock size={12} /> Draft
              </>
            )}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex px-4 py-2 rounded-full text-sm font-black text-white bg-slate-900">
            {priceLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Title & Category */}
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-violet-600 transition-colors">
            {course.title || "Untitled Course"}
          </h3>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
            {course.category || "General"}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {course.description || "No description added yet. Click to edit course details."}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-slate-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 mb-2">
              <Users size={16} className="text-slate-600" />
            </div>
            <p className="text-xl font-black text-slate-900">{enrollmentCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Enrolled</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 mb-2">
              <BookOpen size={16} className="text-slate-600" />
            </div>
            <p className="text-xl font-black text-slate-900">{lessonCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Lessons</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 mb-2">
              <BarChart3 size={16} className="text-slate-600" />
            </div>
            <p className="text-xl font-black text-slate-900">-</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Reviews</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href={`/dashboard/instructor/courses/${course.id}`}
            className="inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-[0.28em] text-white transition-all hover:bg-violet-700 active:scale-95"
          >
            <BarChart3 size={14} /> Manage Course
            <ChevronRight size={14} className="ml-auto" />
          </Link>
          
          <Link
            href={`/learn/${course.id}`}
            className="inline-flex items-center justify-center gap-2 w-full rounded-2xl border border-slate-200 bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.28em] text-slate-700 transition-all hover:bg-slate-500 hover:border-slate-300"
          >
            <Eye size={14} /> Preview Course
          </Link>
        </div>
      </div>
    </div>
  );
}
