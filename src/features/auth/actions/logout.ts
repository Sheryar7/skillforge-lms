"use server";

import { authService } from "../services/auth.service";

export async function logoutAction() {
  try {
    await authService.signOut();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to log out cleanly." };
  }
}