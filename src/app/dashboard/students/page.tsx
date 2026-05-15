import { createSupabaseServer } from "@/lib/supabase-server";
import { approveEnrollment } from "./actions"; 
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";

export default async function StudentsPage() {
  const supabase = await createSupabaseServer();
  
  // 1. Get the current logged-in instructor
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch only requests belonging to THIS instructor
  const { data: enrollments } = await supabase
    .from("enrollment_requests") // Using the request table
    .select(`
      id,
      student_id,
      status,
      profiles:student_id ( full_name, email ),
      courses:course_id ( title )
    `)
    .eq('instructor_id', user.id) // Filtering by instructor
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-4xl font-black text-slate-800">Enrollment Requests</h1>
        <p className="text-slate-500 mt-2">Manage student access to your courses.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-xs uppercase tracking-[0.2em] border-b border-slate-50">
              <th className="pb-6 px-4">Student</th>
              <th className="pb-6 px-4">Course</th>
              <th className="pb-6 px-4">Status</th>
              <th className="pb-6 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {enrollments?.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-slate-400 font-medium">
                  No pending enrollment requests found.
                </td>
              </tr>
            ) : (
              enrollments?.map((enroll: any) => (
                <tr key={enroll.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 px-4">
                    <div className="font-bold text-slate-700">{enroll.profiles?.full_name || "Unknown Student"}</div>
                    <div className="text-xs text-slate-400">{enroll.profiles?.email}</div>
                  </td>
                  <td className="py-6 px-4 font-medium text-slate-600">{enroll.courses?.title}</td>
                  <td className="py-6 px-4">
                    {enroll.status === "active" ? (
                      <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold w-fit">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold w-fit">
                        <Clock size={14} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="py-6 px-4">
                    {enroll.status === "pending" && (
                      <form action={async () => {
                        "use server";
                        await approveEnrollment(enroll.id);
                      }}>
                        <button className="bg-violet-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-violet-700 transition-all shadow-md shadow-violet-100">
                          Approve
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}