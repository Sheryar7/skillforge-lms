import { useState, useEffect, useCallback } from "react";
import { lessonService } from "../services/lesson.service";
import { Lesson } from "../types/lesson.types";

export function useCourseLessons(courseId: string) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLessons = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);

    try {
      const data = await lessonService.getLessonsByCourse(courseId);
      setLessons(data);
    } catch (err: any) {
      setError(err.message || "Failed to load course lessons.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  return { lessons, loading, error, refresh: loadLessons };
}
