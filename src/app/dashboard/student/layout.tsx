"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import Spinner from "@/shared/components/Spinner";

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateStudent = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const role = profile?.role || "student";

      if (error || role !== "student") {
        router.replace("/dashboard/instructor");
        return;
      }

      setLoading(false);
    };

    validateStudent();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Spinner />
        <p className="text-xs font-bold text-slate-400 mt-3 tracking-wider uppercase">Verifying student access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
