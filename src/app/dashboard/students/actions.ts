"use server";

import { createSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function approveEnrollment(enrollmentId: string) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("enrollments")
    .update({ status: "active" }) // Changes status from pending to active
    .eq("id", enrollmentId);

  if (error) {
    throw new Error(error.message);
  }

  // This refreshes the data on the page immediately
  revalidatePath("/dashboard/students");
}