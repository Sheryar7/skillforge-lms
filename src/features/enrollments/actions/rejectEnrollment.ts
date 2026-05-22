"use server";

import { enrollmentService } from "../services/enrollment.service";

export async function rejectEnrollmentAction(requestId: string) {
  try {
    await enrollmentService.updateRequestStatus(requestId, "rejected");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reject enrollment request." };
  }
}