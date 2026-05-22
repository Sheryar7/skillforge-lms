"use server";

import { sectionService } from "../services/section.service";
import { UpdateSectionInput } from "../types/section.types";

export async function updateSectionAction(sectionId: string, updates: UpdateSectionInput) {
  try {
    const updated = await sectionService.updateSection(sectionId, updates);
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save section parameters." };
  }
}