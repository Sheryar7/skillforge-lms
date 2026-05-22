"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import Spinner from "@/shared/components/Spinner";

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const routeUserByRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Unable to resolve role during redirect:", error);
      }

      const userRole = profile?.role === "instructor" ? "instructor" : "student";

      router.replace(userRole === "instructor" ? "/dashboard/instructor" : "/dashboard/student");
    };

    routeUserByRole();
  }, [router]);

  return (
    <div className="h-[60vh] flex flex-col items-center justify-center">
      <Spinner />
      <p className="text-xs font-bold text-slate-400 mt-3 tracking-wider uppercase">Loading your personalized dashboard...</p>
    </div>
  );
}
