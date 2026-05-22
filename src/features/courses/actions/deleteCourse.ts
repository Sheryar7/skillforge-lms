"use server";

import { supabase } from "@/lib/supabase-client";

export async function deleteCourseAction(courseId: string) {
  try {
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to execute deletion server action." };
  }
}