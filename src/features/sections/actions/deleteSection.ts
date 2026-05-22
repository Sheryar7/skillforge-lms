"use server";

import { sectionService } from "../services/section.service";

export async function deleteSectionAction(sectionId: string) {
  try {
    await sectionService.deleteSection(sectionId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to clear target section cluster." };
  }
}