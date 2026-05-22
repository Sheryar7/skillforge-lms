"use server";

import { sectionService } from "../services/section.service";

export async function moveSectionAction(courseId: string, sectionId: string, direction: "up" | "down") {
  try {
    const updated = await sectionService.reorderSection(courseId, sectionId, direction);
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reorder sections." };
  }
}
