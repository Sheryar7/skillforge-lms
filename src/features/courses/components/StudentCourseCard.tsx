"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Users, Star, ChevronRight } from "lucide-react";
import { Course } from "../types/course.types";

interface StudentCourseCardProps {
  course: Course;
  enrollmentCount?: number;
  averageRating?: number;
}

export default function StudentCourseCard({ 
  course,
  enrollmentCount = 0,
  averageRating = 0
}: StudentCourseCardProps) {
  const priceLabel = course.price === 0 ? "Free" : `$${course.price}`;
  const ratingDisplay = averageRating > 0 ? averageRating.toFixed(1) : "New";

  return (
    <Link href={`/learn/${course.id}`}>
      <div className="group h-full bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-slate-300 hover:scale-[1.02]">
        {/* Thumbnail */}
        <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              unoptimized
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-slate-50">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-100">
                  <BookOpen size={24} className="text-violet-600" />
                </div>
              </div>
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex px-4 py-2 rounded-full text-sm font-black text-white bg-slate-900">
              {priceLabel}
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black text-white bg-slate-900/80 backdrop-blur-sm">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              {ratingDisplay}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 h-full flex flex-col">
          {/* Category & Level */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-violet-600 px-2.5 py-1 bg-violet-50 rounded-full">
              {course.level || "Beginner"}
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 px-2.5 py-1 bg-slate-100 rounded-full">
              {course.category || "General"}
            </span>
          </div>

          {/* Title */}
          <div className="flex-1">
            <h3 className="text-lg font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-violet-600 transition-colors">
              {course.title || "Untitled Course"}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {course.description || "Learn valuable skills from an experienced instructor."}
          </p>

          {/* Footer with enrollment count and CTA */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Users size={14} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500">
                {enrollmentCount > 0 ? `${enrollmentCount} enrolled` : "New course"}
              </span>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
