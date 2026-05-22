import { useState, useEffect } from "react";
import { authService } from "../services/auth.service";
import { UserProfile } from "../types/auth.types";
import { supabase } from "@/lib/supabase-client";

export function useAuth() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    async function getUser() {
      try {
        const profile = await authService.getCurrentUser();
        setUserProfile(profile);
      } catch {
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    }
    
    getUser();

    // Listen to changes (login/logout events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const profile = await authService.getCurrentUser();
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { userProfile, loading, isAuthenticated: !!userProfile };
}