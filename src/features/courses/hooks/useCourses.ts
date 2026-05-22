import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase-client";
import { courseService } from "../services/course.service";
import { Course } from "../types/course.types";

export function useCourses(filterByInstructor = false) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let data: Course[] = [];
      if (filterByInstructor && user) {
        data = await courseService.getInstructorCourses(user.id);
      } else {
        data = await courseService.getAllCourses();
      }
      
      setCourses(data);
    } catch (err: any) {
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, [filterByInstructor]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return { courses, loading, error, refresh: loadCourses };
}