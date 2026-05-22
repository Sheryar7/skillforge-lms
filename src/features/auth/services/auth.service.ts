import { supabase } from "@/lib/supabase-client";
import { UserProfile, UserRole } from "../types/auth.types";

export const authService = {
  /**
   * Gets the current authenticated session user and their profile record
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) return null;

    return profile as UserProfile;
  },

  /**
   * Signs out the current active session
   */
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }
};