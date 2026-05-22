"use client";

import { useState } from "react";
import { Folder, ChevronDown, ChevronUp, Trash2, Edit3, ArrowUp, ArrowDown } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/shared/ui/button";

import LessonList from "@/features/lessons/components/LessonList";
import LessonEditorModal from "@/features/lessons/components/LessonEditorModal";
import SectionEditorModal from "./SectionEditorModal";
import { Section } from "../types/section.types";
import { deleteSectionAction } from "../actions/deleteSection";
import { moveSectionAction } from "../actions/moveSection";

interface SectionItemProps {
  section: Section;
  onRefresh: () => void;
  isInstructor?: boolean;
}

export default function SectionItem({ section, onRefresh, isInstructor = true }: SectionItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshLessonsToggle, setRefreshLessonsToggle] = useState(false);
  const [lessonStats, setLessonStats] = useState({ count: 0, formattedDuration: "0m" });

  const handleDelete = async () => {
    if (!confirm("Deleting this chapter removes all child content. Proceed?")) return;
    setLoading(true);
    try {
      const result = await deleteSectionAction(section.id);
      if (!result.success) throw new Error(result.error);
      toast.success("Chapter block removed.");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to drop chapter segment.");
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (direction: "up" | "down") => {
    setLoading(true);
    try {
      const result = await moveSectionAction(section.course_id, section.id, direction);
      if (!result.success) throw new Error(result.error);
      toast.success("Chapter order updated.");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to reorder chapter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50/50 border border-slate-200/60 rounded-[2.5rem] p-6 space-y-4 transition-all">
      {/* Header Container Banner */}
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center gap-3">
          <div className="p-3 bg-white border border-slate-100 shadow-sm rounded-xl text-violet-600">
            <Folder size={20} fill="currentColor" fillOpacity={0.1} />
          </div>
          
          <div className="cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
            <h3 className="font-black text-slate-900 text-base tracking-tight">{section.title}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Chapter Segment</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-slate-500">
              <span>{lessonStats.count} lessons</span>
              <span>{lessonStats.formattedDuration}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {isInstructor && (
            <>
              <Button
                onClick={() => handleMove("up")}
                variant="secondary"
                className="p-2 text-slate-400 hover:text-violet-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 shadow-none"
                disabled={loading}
              >
                <ArrowUp size={14} />
              </Button>
              <Button
                onClick={() => handleMove("down")}
                variant="secondary"
                className="p-2 text-slate-400 hover:text-violet-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 shadow-none"
                disabled={loading}
              >
                <ArrowDown size={14} />
              </Button>
              <SectionEditorModal
                courseId={section.course_id}
                section={section}
                onSaved={onRefresh}
                triggerLabel="Edit"
              />
              <Button 
                onClick={handleDelete} 
                variant="danger"
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl border border-transparent shadow-none"
              >
                <Trash2 size={14} />
              </Button>
            </>
          )}
          
          <Button 
            onClick={() => setIsExpanded(!isExpanded)}
            variant="secondary"
            className="p-2 text-slate-500 bg-white border border-slate-100 shadow-sm rounded-xl hover:bg-slate-100 ml-1"
          >
            {isExpanded ? <ChevronUp size={16} strokeWidth={2.5} /> : <ChevronDown size={16} strokeWidth={2.5} />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pl-4 border-l-2 border-slate-200/70 ml-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <LessonList 
            sectionId={section.id} 
            isInstructor={isInstructor} 
            onStats={(stats) => setLessonStats(stats)}
            key={String(refreshLessonsToggle)} 
          />
          
          {isInstructor && (
            <LessonEditorModal 
              sectionId={section.id} 
              courseId={section.course_id} 
              onSaved={() => setRefreshLessonsToggle(!refreshLessonsToggle)} 
            />
          )}
        </div>
      )}
    </div>
  );
}