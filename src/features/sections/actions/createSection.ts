"use server";

import { sectionService } from "../services/section.service";
import { CreateSectionInput } from "../types/section.types";

export async function createSectionAction(input: CreateSectionInput) {
  try {
    const newSection = await sectionService.createSection(input);
    return { success: true, data: newSection };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to finalize section creation routing action." };
  }
}