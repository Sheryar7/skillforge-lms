"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { enrollmentService, EnrollmentRequest } from "@/features/courses/services/enrollment.service";
import { UserCheck, Users, Check, X, Clock, GraduationCap } from "lucide-react";

interface ActiveStudent {
  id: string;
  user_id?: string | null;
  course_id?: string | null;
  created_at?: string | null;
  profiles?: {
    full_name?: string | null;
    email?: string | null;
  };
  courses?: {
    title?: string | null;
  };
}

export default function InstructorStudentsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "requests">("active");
  const [instructorId, setInstructorId] = useState<string | null>(null);
  const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
  const [activeStudents, setActiveStudents] = useState<ActiveStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const currentUserId = session.user.id;
        setInstructorId(currentUserId);

        const [pendingReqs, enrolledUsers] = await Promise.all([
          enrollmentService.getPendingRequests(currentUserId),
          enrollmentService.getActiveStudents(currentUserId),
        ]);

        setRequests(pendingReqs);
        setActiveStudents(enrolledUsers);
      } catch (err) {
        console.error("Error aggregating student arrays:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleDecision = async (req: EnrollmentRequest, status: "approved" | "rejected") => {
    setActioningId(req.id);

    try {
      await enrollmentService.handleRequestDecision(req, status);
      setRequests((prev) => prev.filter((item) => item.id !== req.id));

      if (status === "approved" && instructorId) {
        const updatedStudents = await enrollmentService.getActiveStudents(instructorId);
        setActiveStudents(updatedStudents);
      }
    } catch (err) {
      console.error("Action handler failed:", err);
    } finally {
      setActioningId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] w-full flex items-center justify-center text-slate-400 font-medium text-sm">
        Loading student roster context...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto p-2">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Roster Management</h1>
        <p className="text-slate-500 text-sm mt-1">Review active program participants and evaluate pending admission applications.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row border-b border-slate-100 pb-4 text-sm font-bold">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-4 flex items-center gap-2 transition-all relative ${
            activeTab === "active" ? "text-violet-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Users size={16} />
          Active Students ({activeStudents.length})
          {activeTab === "active" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 rounded-full" />}
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`pb-4 flex items-center gap-2 transition-all relative ${
            activeTab === "requests" ? "text-violet-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <UserCheck size={16} />
          Enrollment Requests ({requests.length})
          {requests.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
              {requests.length}
            </span>
          )}
          {activeTab === "requests" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 rounded-full" />}
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
        {activeTab === "active" ? (
          activeStudents.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              <GraduationCap className="mx-auto mb-3 text-slate-300" size={36} />
              No students are currently enrolled in your curriculum.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-wider border-b border-slate-100">
                    <th className="p-5">Student</th>
                    <th className="p-5">Course</th>
                    <th className="p-5">Joined</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-50">
                  {activeStudents.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-5 font-bold text-slate-800">
                        {item.profiles?.full_name || item.profiles?.email || `Student ID: ${item.user_id?.slice(0, 8)}...`}
                      </td>
                      <td className="p-5 text-slate-600">
                        {item.courses?.title || `Course ID: ${item.course_id?.slice(0, 8)}...`}
                      </td>
                      <td className="p-5 text-slate-400 text-xs">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(undefined, {
                              dateStyle: "medium",
                            })
                          : "Unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : requests.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            <Clock className="mx-auto mb-3 text-slate-300" size={36} />
            No pending approval requests at the moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-wider border-b border-slate-100">
                  <th className="p-5">Applicant</th>
                  <th className="p-5">Target Course</th>
                  <th className="p-5">Submitted</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-50">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-5 font-bold text-slate-800">
                      {req.profiles?.full_name || req.profiles?.email || `Student ID: ${req.student_id.slice(0, 8)}...`}
                    </td>
                    <td className="p-5 text-slate-600 font-semibold">
                      {req.courses?.title || `Course ID: ${req.course_id.slice(0, 8)}...`}
                    </td>
                    <td className="p-5 text-slate-400 text-xs">
                      {new Date(req.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </td>
                    <td className="p-5 text-right space-x-2 shrink-0">
                      <button
                        disabled={actioningId === req.id}
                        onClick={() => handleDecision(req, "approved")}
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition"
                      >
                        <Check size={14} /> Accept
                      </button>
                      <button
                        disabled={actioningId === req.id}
                        onClick={() => handleDecision(req, "rejected")}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 text-slate-600 font-bold text-xs px-3 py-1.5 rounded-xl transition"
                      >
                        <X size={14} /> Deny
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
