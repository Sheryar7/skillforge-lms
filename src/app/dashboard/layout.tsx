import Sidebar from "@/components/Sidebar";
import { createSupabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();
  
  // 1. Get the current user session
  const { data: { user } } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user) {
    redirect("/login");
  }

  // 2. Fetch the role from the 'profiles' table (corrected from 'users')
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Default to 'student' if no profile or role is found
  const userRole = profile?.role || "student";

  return (
    <div className="h-screen flex overflow-hidden bg-[#f5f7fb]">
      {/* Pass the dynamic userRole to the Sidebar */}
      <Sidebar userRole={userRole} />

      {/* Main Content area */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}