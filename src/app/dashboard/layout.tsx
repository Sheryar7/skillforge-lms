"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import Sidebar from "@/shared/components/Sidebar";
import Spinner from "@/shared/components/Spinner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        setUserRole(profile?.role || "student");
        setAuthenticated(true);
      } catch (err) {
        console.error("Error fetching user role context:", err);
        setUserRole("student");
        setAuthenticated(true);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    if (!loading && authenticated && userRole) {
      const isStudentRoute = pathname.startsWith("/dashboard/student");
      const isInstructorRoute = pathname.startsWith("/dashboard/instructor") || pathname.startsWith("/dashboard/analytics") || pathname.startsWith("/dashboard/users");

      if (userRole === "student" && isInstructorRoute) {
        router.replace("/dashboard/student");
      }

      if (userRole === "instructor" && isStudentRoute) {
        router.replace("/dashboard/instructor");
      }
    }
  }, [loading, authenticated, userRole, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Spinner />
        <p className="text-xs font-bold text-slate-400 mt-3 tracking-wider uppercase">Synchronizing secure session matrix...</p>
      </div>
    );
  }

  if (!authenticated || !userRole) return null;

  return (
    <div className="w-full flex bg-slate-50" style={{ height: "calc(100vh - 77px)" }}>
      <aside className="hidden md:block w-72 h-full sticky top-0 left-0 overflow-hidden shrink-0 z-40 bg-white border-r border-gray-200">
        <Sidebar userRole={userRole} />
      </aside>

      <div className="flex-1 min-w-0 h-full overflow-y-auto bg-slate-50 p-6 md:p-8">
        <div className="max-w-7xl w-full mx-auto animate-in fade-in duration-300 pb-12">
          {children}
        </div>
      </div>
    </div>
  );
}
