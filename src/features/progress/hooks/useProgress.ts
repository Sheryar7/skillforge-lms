import { useState, useEffect, useCallback } from "react";
import { progressService } from "../services/progress.service";
import { LessonProgress, CourseProgressSummary } from "../types/progress.types";

export function useProgress(studentId: string, courseId: string) {
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [summary, setSummary] = useState<CourseProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProgressData = useCallback(async () => {
    if (!studentId || !courseId) return;
    setLoading(true);
    setError(null);
    try {
      const [progressList, progressSummary] = await Promise.all([
        progressService.getStudentProgressForCourse(studentId, courseId),
        progressService.getCourseProgressSummary(studentId, courseId)
      ]);

      const completedIds = progressList
        .filter((p) => p.is_completed)
        .map((p) => p.lesson_id);

      setCompletedLessonIds(completedIds);
      setSummary(progressSummary);
    } catch (err: any) {
      setError(err.message || "Failed to load curriculum completion progress.");
    } finally {
      setLoading(false);
    }
  }, [studentId, courseId]);

  const toggleLesson = async (lessonId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await progressService.toggleLessonCompletion(studentId, courseId, lessonId, newStatus);
      
      // Optimistic local state updates for instant UI re-renders
      setCompletedLessonIds((prev) =>
        newStatus ? [...prev, lessonId] : prev.filter((id) => id !== lessonId)
      );
      
      // Silently refresh summary scores in background
      const updatedSummary = await progressService.getCourseProgressSummary(studentId, courseId);
      setSummary(updatedSummary);
    } catch (err: any) {
      console.error("Progress tracking mutation failed:", err);
    }
  };

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  return {
    completedLessonIds,
    summary,
    loading,
    error,
    toggleLesson,
    isLessonCompleted: (id: string) => completedLessonIds.includes(id),
    refreshProgress: loadProgressData
  };
}