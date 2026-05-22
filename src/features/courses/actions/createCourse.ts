"use server";

import { courseService } from "../services/course.service";
import { CreateCourseInput } from "../types/course.types";

export async function createCourseAction(input: CreateCourseInput, instructorId: string) {
  try {
    const newCourse = await courseService.createCourse(input, instructorId);
    return { success: true, data: newCourse };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to execute course creation server action." };
  }
}