"use server";

import { lessonService } from "../services/lesson.service";

export async function deleteLessonAction(lessonId: string) {
  try {
    await lessonService.deleteLesson(lessonId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to execute lesson removal server action." };
  }
}