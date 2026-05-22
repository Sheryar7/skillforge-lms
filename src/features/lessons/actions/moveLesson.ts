"use server";

import { lessonService } from "../services/lesson.service";

export async function moveLessonAction(sectionId: string, lessonId: string, direction: "up" | "down") {
  try {
    const updated = await lessonService.reorderLesson(sectionId, lessonId, direction);
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reorder lessons." };
  }
}
