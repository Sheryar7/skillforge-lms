"use server";

import { supabase } from "@/lib/supabase-client";
import { UserRole } from "../types/auth.types";

export async function signupAction(email: string, password: string, fullName: string, role: UserRole) {
  try {
    // 1. Create the user authentication account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error("User creation failed.");

    // 2. Insert custom profile record tracking their selected role path
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        role: role,
      });

    if (profileError) throw profileError;

    return { success: true, role };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to register user account." };
  }
}