"use server";

import { enrollmentService } from "../services/enrollment.service";

export async function approveEnrollmentAction(requestId: string) {
  try {
    await enrollmentService.updateRequestStatus(requestId, "approved");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to approve enrollment request." };
  }
}