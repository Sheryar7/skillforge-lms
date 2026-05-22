"use client";

import { useEffect } from "react";
import { Video } from "lucide-react";
import Spinner from "@/shared/components/Spinner";
import EmptyState from "@/shared/components/EmptyState";

import { useLessons } from "../hooks/useLessons";
import LessonItem from "./LessonItem";

interface LessonListProps {
  sectionId: string;
  isInstructor?: boolean;
  onStats?: (stats: { count: number; formattedDuration: string }) => void;
}

function formatLessonDuration(duration?: string | null) {
  if (!duration) return 0;
  const parts = duration.split(":").map((part) => Number(part));
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return Number(parts[0]) || 0;
}

function formatTotalDuration(totalSeconds: number) {
  if (totalSeconds === 0) return "0m";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function LessonList({ sectionId, isInstructor = true, onStats }: LessonListProps) {
  const { lessons, loading, error, refresh } = useLessons(sectionId);

  useEffect(() => {
    if (!onStats || loading || error) return;
    const totalSeconds = lessons.reduce((sum, lesson) => sum + formatLessonDuration(lesson.duration), 0);
    onStats({ count: lessons.length, formattedDuration: formatTotalDuration(totalSeconds) });
  }, [lessons, loading, error, onStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-xs font-bold text-red-500 p-2">{error}</p>;
  }

  if (lessons.length === 0) {
    return (
      <div className="py-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center">
        <EmptyState
          title="No content items published here yet."
          description="Get started by attaching your first lesson curriculum node to this section overlay block layout matrix."
          icon={Video}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {lessons.map((lesson) => (
        <LessonItem 
          key={lesson.id} 
          lesson={lesson} 
          onRefresh={refresh} 
          isInstructor={isInstructor} 
        />
      ))}
    </div>
  );
}
