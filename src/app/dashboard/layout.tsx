import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 🔐 Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🚫 If NOT logged in → redirect
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
        
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-purple-600">
            Sherry LMS
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <Link
            href="/dashboard"
            className="block px-4 py-2 bg-purple-100 text-purple-700 rounded-lg"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/courses"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Courses
          </Link>

          <Link
            href="/dashboard/users"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Users
          </Link>

          <Link
            href="/dashboard/settings"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Settings
          </Link>

        </nav>

        <div className="p-4 border-t text-sm text-gray-500">
          © 2026 Sherry LMS
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">

          <h2 className="text-lg font-semibold text-gray-800">
            Dashboard
          </h2>

          <div className="flex items-center gap-4">

            <input
              placeholder="Search..."
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            {/* Avatar */}
            <div className="w-9 h-9 bg-purple-600 text-white flex items-center justify-center rounded-full font-semibold">
              {user.email?.charAt(0).toUpperCase()}
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </div>
  );
}