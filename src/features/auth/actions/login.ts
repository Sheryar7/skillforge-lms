"use server";

import { supabase } from "@/lib/supabase-client";

export async function loginAction(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch profile to verify role routing
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user?.id)
      .single();

    if (profileError) throw profileError;

    return { success: true, role: profile.role };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to log in." };
  }
}