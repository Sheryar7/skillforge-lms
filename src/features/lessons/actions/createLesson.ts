"use server";

import { lessonService } from "../services/lesson.service";
import { CreateLessonInput } from "../types/lesson.types";

export async function createLessonAction(input: CreateLessonInput) {
  try {
    const newLesson = await lessonService.createLesson(input);
    return { success: true, data: newLesson };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create lesson entry record." };
  }
}