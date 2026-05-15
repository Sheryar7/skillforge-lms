import { createSupabaseServer } from "@/lib/supabase-server";

export default async function UsersPage() {
  const supabase = await createSupabaseServer();
  
  // Note: auth.admin.listUsers() requires a service_role key. 
  // For now, we show a professional placeholder UI.
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
      <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-300">
        <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-700">Access Restricted</h2>
        <p className="text-gray-500 mt-2">Only administrators can manage global user accounts.</p>
      </div>
    </div>
  );
}