"use client";

import { useEffect, useState } from "react";
import { Check, X, Clock, Users, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase-client";
import { useEnrollment } from "../hooks/useEnrollment";

interface PendingRequest {
  id: string;
  created_at: string;
  student_id: string;
  course_id: string;
  status: string;
  courses: {
    title: string;
  };
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
}

export default function InstructorRequestsDashboard() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { updateRequestStatus, loading: actionLoading } = useEnrollment();

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Query requests filtering by current instructor context and joining course & profile data
      const { data, error } = await supabase
        .from("enrollment_requests")
        .select(`
          id,
          created_at,
          student_id,
          course_id,
          status,
          courses!inner ( title ),
          profiles:student_id ( full_name, avatar_url )
        `)
        .eq("instructor_id", session.user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests((data as any) || []);
    } catch (error: any) {
      console.error("Error fetching enrollment queue:", error);
      toast.error("Could not load the incoming enrollment queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleAction = async (id: string, action: "accepted" | "rejected") => {
    const success = await updateRequestStatus(id, action);
    if (success) {
      // Optimistically filter out the handled item from the view array immediately
      setRequests((prev) => prev.filter((req) => req.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] w-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-violet-600" size={32} />
        <p className="text-xs font-black text-slate-400 mt-3 tracking-widest uppercase">
          Loading Enrollment Queue...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto px-1">
      {/* SECTION HEADER PANEL */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest uppercase text-amber-600">
              Review Pipeline
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Enrollment Gatekeeper Matrix
          </h1>
          <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
            Audit inbound student access requests. Granting approval unlocks curriculum workspaces instantaneously.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl shrink-0">
          <Users size={18} className="text-slate-400" />
          <div>
            <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Total Pending
            </div>
            <div className="text-lg font-black text-violet-600">{requests.length} Requests</div>
          </div>
        </div>
      </div>

      {/* QUEUE LIST VIEW */}
      {requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
          <div className="mx-auto w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
            <Clock size={22} />
          </div>
          <h3 className="font-black text-slate-700 text-base">Inbound Request Queue is Clear</h3>
          <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
            There are currently no outstanding authorization nodes requiring validation loops.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-md hover:border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              {/* Left Column: Student Credentials & Target Course */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-black text-sm flex items-center justify-center tracking-wider shrink-0 uppercase shadow-sm shadow-violet-100">
                  {request.profiles?.full_name?.substring(0, 2) || "ST"}
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 tracking-tight text-base">
                    {request.profiles?.full_name || "Unknown Student"}
                  </h4>
                  
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                      <BookOpen size={13} className="text-violet-500" /> 
                      {request.courses?.title || "Target Curriculum"}
                    </span>
                    <span className="text-[10px] uppercase font-black tracking-wide text-slate-400">
                      Requested {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interaction Action Split buttons */}
              <div className="flex items-center gap-3 sm:self-center self-end w-full sm:w-auto">
                <button
                  onClick={() => handleAction(request.id, "rejected")}
                  disabled={actionLoading}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
                >
                  <X size={14} /> Deny
                </button>
                
                <button
                  onClick={() => handleAction(request.id, "accepted")}
                  disabled={actionLoading}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-3 bg-violet-600 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm transition-colors disabled:opacity-50"
                >
                  <Check size={14} /> Approve Access
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}