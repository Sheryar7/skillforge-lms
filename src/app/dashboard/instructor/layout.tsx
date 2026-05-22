"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import Spinner from "@/shared/components/Spinner";

export default function InstructorDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateInstructor = async () => {
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

      if (error || role !== "instructor") {
        router.replace("/dashboard/student");
        return;
      }

      setLoading(false);
    };

    validateInstructor();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Spinner />
        <p className="text-xs font-bold text-slate-400 mt-3 tracking-wider uppercase">Verifying instructor access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
