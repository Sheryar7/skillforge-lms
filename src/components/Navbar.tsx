"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";
import LogoutButton from "./LogoutButton";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getInitialSession();

    // 2. Listen for auth changes (Login, Logout, Sign In)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-purple-600">
          Sherry LMS
        </Link>

        {/* Links */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 text-gray-600 hover:text-purple-600 transition"
          >
            Home
          </Link>

          {/* Updated Conditional Rendering Logic */}
          {!user ? (
            <Link
              href="/login"
              className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition shadow-md shadow-purple-100"
            >
              Get Started
            </Link>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-600 hover:text-purple-600 transition"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}