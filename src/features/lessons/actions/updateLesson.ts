"use server";

import { lessonService } from "../services/lesson.service";
import { UpdateLessonInput } from "../types/lesson.types";

export async function updateLessonAction(lessonId: string, updates: UpdateLessonInput) {
  try {
    const updated = await lessonService.updateLesson(lessonId, updates);
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update target lesson row data." };
  }
}