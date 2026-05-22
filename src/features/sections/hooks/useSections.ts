import { useState, useEffect, useCallback } from "react";
import { sectionService } from "../services/section.service";
import { Section } from "../types/section.types";

export function useSections(courseId: string, enabled = true) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const loadSections = useCallback(async () => {
    if (!courseId || !enabled) return;
    setLoading(true);
    setError(null);
    try {
      const data = await sectionService.getSectionsByCourse(courseId);
      setSections(data);
    } catch (err: any) {
      setError(err.message || "Failed to collect course chapter modules layout data.");
    } finally {
      setLoading(false);
    }
  }, [courseId, enabled]);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  return { sections, loading, error, refresh: loadSections };
}