"use server";

import { courseService } from "../services/course.service";
import { UpdateCourseInput } from "../types/course.types";

export async function updateCourseAction(courseId: string, updates: UpdateCourseInput) {
  try {
    const updatedCourse = await courseService.updateCourse(courseId, updates);
    return { success: true, data: updatedCourse };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to execute modification update server action." };
  }
}