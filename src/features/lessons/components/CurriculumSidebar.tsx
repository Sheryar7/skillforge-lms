"use client";

import { useState } from "react";
import { ChevronDown, Play, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Section } from "@/features/sections/types/section.types";
import { Lesson } from "@/features/lessons/types/lesson.types";

interface CurriculumSidebarProps {
  courseId: string;
  currentLessonId?: string;
  sections: Section[];
  lessons: Lesson[];
  completedLessonIds?: string[];
  isEnrolled: boolean;
  isPreview?: boolean;
}

export default function CurriculumSidebar({
  courseId,
  currentLessonId,
  sections,
  lessons,
  completedLessonIds = [],
  isEnrolled,
  isPreview = false,
}: CurriculumSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(sections.map((s) => s.id).slice(0, 1)));

  const toggleSection = (sectionId: string) => {
    const updated = new Set(expandedSections);
    if (updated.has(sectionId)) {
      updated.delete(sectionId);
    } else {
      updated.add(sectionId);
    }
    setExpandedSections(updated);
  };

  const getLessonsBySection = (sectionId: string) => {
    return lessons.filter((lesson) => lesson.section_id === sectionId);
  };

  const getProgressForSection = (sectionId: string) => {
    const sectionLessons = getLessonsBySection(sectionId);
    const completed = sectionLessons.filter((l) => completedLessonIds.includes(l.id)).length;
    return { completed, total: sectionLessons.length };
  };

  return (
    <div className="w-full max-h-screen overflow-y-auto border border-slate-200 rounded-[2.5rem] bg-white shadow-sm">
      <div className="space-y-1 p-4">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const progress = getProgressForSection(section.id);
          const sectionLessons = getLessonsBySection(section.id);

          return (
            <div key={section.id} className="space-y-1">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 transition text-left"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-slate-900 truncate">{section.title}</h4>
                  <p className="text-[11px] font-medium text-slate-400">
                    {progress.completed} of {progress.total} completed
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`flex-shrink-0 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {isExpanded && (
                <div className="space-y-1 pl-2">
                  {sectionLessons.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-400">No lessons in this section yet.</div>
                  ) : (
                    sectionLessons.map((lesson) => {
                      const isCurrentLesson = lesson.id === currentLessonId;
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      const canAccess = isEnrolled || lesson.is_preview;

                      return (
                        <div key={lesson.id}>
                          {canAccess ? (
                            <Link
                              href={`/learn/${courseId}/lesson/${lesson.id}`}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition text-left ${
                                isCurrentLesson
                                  ? "bg-violet-50 border border-violet-200"
                                  : "hover:bg-slate-50 border border-transparent"
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {isCompleted ? (
                                  <CheckCircle2 size={16} className="text-green-600" />
                                ) : isCurrentLesson ? (
                                  <Play size={16} className="text-violet-600" />
                                ) : (
                                  <Play size={16} className="text-slate-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-xs font-bold truncate ${
                                    isCurrentLesson ? "text-violet-600" : "text-slate-700"
                                  }`}
                                >
                                  {lesson.title}
                                </p>
                                {lesson.duration && (
                                  <p className="text-[10px] text-slate-400">{lesson.duration}</p>
                                )}
                              </div>
                            </Link>
                          ) : (
                            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 opacity-60">
                              <Lock size={16} className="flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{lesson.title}</p>
                                {lesson.duration && (
                                  <p className="text-[10px]">{lesson.duration}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
