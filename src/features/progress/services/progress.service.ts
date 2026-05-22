import { supabase } from "@/lib/supabase-client";
import { LessonProgress, CourseProgressSummary } from "../types/progress.types";

export const progressService = {
  /**
   * Fetches all completed lesson progress rows for a specific student in a course
   */
  async getStudentProgressForCourse(studentId: string, courseId: string): Promise<LessonProgress[]> {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("student_id", studentId)
      .eq("course_id", courseId);

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Toggles the completion state for a specific lesson node
   */
  async toggleLessonCompletion(
    studentId: string,
    courseId: string,
    lessonId: string,
    isCompleted: boolean
  ): Promise<void> {
    const { error } = await supabase
      .from("user_progress")
      .upsert(
        {
          student_id: studentId,
          course_id: courseId,
          lesson_id: lessonId,
          is_completed: isCompleted,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "student_id,lesson_id" }
      );

    if (error) throw new Error(error.message);
  },

  /**
   * Calculates the macro progress percentage metrics for a specific course dashboard
   */
  async getCourseProgressSummary(studentId: string, courseId: string): Promise<CourseProgressSummary> {
    // 1. Fetch total published lessons in this course
    const { count: totalCount, error: totalError } = await supabase
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("course_id", courseId);

    if (totalError) throw totalError;

    // 2. Fetch completed records count
    const { count: completedCount, error: completedError } = await supabase
      .from("user_progress")
      .select("id", { count: "exact", head: true })
      .eq("student_id", studentId)
      .eq("course_id", courseId)
      .eq("is_completed", true);

    if (completedError) throw completedError;

    const total = totalCount || 0;
    const completed = completedCount || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      courseId,
      totalLessons: total,
      completedLessons: completed,
      percentage,
    };
  }
};