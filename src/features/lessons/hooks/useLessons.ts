import { useState, useEffect, useCallback } from "react";
import { lessonService } from "../services/lesson.service";
import { Lesson } from "../types/lesson.types";

export function useLessons(sectionId: string) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLessons = useCallback(async () => {
    if (!sectionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await lessonService.getLessonsBySection(sectionId);
      setLessons(data);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve chapter content listings.");
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  return { lessons, loading, error, refresh: loadLessons };
}