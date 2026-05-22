"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { UserProfile, UserRole } from "@/features/auth/types/auth.types";

interface AuthContextValue {
  user: any | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const activeUser = session?.user ?? null;
      setUser(activeUser);

      if (activeUser) {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, role, email")
          .eq("id", activeUser.id)
          .single();

        if (!error && data) {
          setProfile(data as UserProfile);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("AuthProvider load session failed:", err);
      setProfile(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
    const { data: subscription } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null);
      await loadSession();
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      role: profile?.role ?? null,
      loading,
      isAuthenticated: Boolean(user && profile),
      refresh: loadSession,
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
}
