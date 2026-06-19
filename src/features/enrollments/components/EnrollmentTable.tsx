"use client";

import { useState } from "react";
import { Check, X, GraduationCap, Mail, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

// Importing your clean shared design tokens
import Spinner from "@/shared/components/Spinner";
import EmptyState from "@/shared/components/EmptyState";
import { Button } from "@/shared/ui/button";

import { useEnrollments } from "../hooks/useEnrollments";
import { approveEnrollmentAction } from "../actions/approveEnrollment";
import { rejectEnrollmentAction } from "../actions/rejectEnrollment";

export default function EnrollmentTable() {
  const { requests, loading, error, refresh } = useEnrollments();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (id: string, type: "approve" | "reject") => {
    setProcessingId(id);
    try {
      const action = type === "approve" ? approveEnrollmentAction : rejectEnrollmentAction;
      const result = await action(id);

      if (!result.success) throw new Error(result.error);

      toast.success(`Registration successfully ${type}d!`);
      refresh();
    } catch (err: any) {
      toast.error(err.message || `Failed to modify registration tracking entry status.`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-100">
        <Spinner />
        <p className="text-slate-400 text-sm font-bold mt-4">Retrieving student registration logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-3xl font-bold text-sm border border-red-100">
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        title="No enrollment requests"
        description="When students apply to your courses, they will appear right here."
      />
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-100/40">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100">
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><GraduationCap size={14}/> Student Profile</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400"><BookOpen size={14}/> Target Curriculum</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Current Status</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Review Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/40 transition-colors group">
                {/* Profile Meta Column */}
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-800 text-base">{req.profiles?.full_name || "Anonymous Student"}</span>
                    <span className="text-slate-400 font-medium text-xs flex items-center gap-1 mt-0.5">
                      <Mail size={12}/> {req.profiles?.email}
                    </span>
                  </div>
                </td>

                {/* Course Meta Column */}
                <td className="p-6">
                  <span className="font-bold text-slate-700 text-sm bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                    {req.courses?.title || "Unknown Curriculum Module"}
                  </span>
                </td>

                {/* Status Column */}
                <td className="p-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    req.status === "approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                    req.status === "rejected" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                    "bg-amber-50 text-amber-600 border border-amber-100 animate-pulse"
                  }}`}>
                    {req.status}
                  </span>
                </td>

                {/* Processing Interactive Column Actions */}
                <td className="p-6 text-right">
                  {req.status === "pending" ? (
                    <div className="flex items-center justify-end gap-3">
                      {/* Reject Button Primitive */}
                      <Button
                        variant="secondary"
                        disabled={processingId !== null}
                        isLoading={processingId === req.id}
                        onClick={() => handleAction(req.id, "reject")}
                        className="p-2.5 bg-slate-50 border-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 rounded-xl shadow-none"
                        title="Reject Student Registration"
                      >
                        {processingId !== req.id && <X size={16} strokeWidth={2.5} />}
                      </Button>

                      {/* Approve Button Primitive */}
                      <Button
                        variant="primary"
                        disabled={processingId !== null}
                        isLoading={processingId === req.id}
                        onClick={() => handleAction(req.id, "approve")}
                        className="px-4 py-2.5 text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-violet-100"
                        title="Approve Student Registration"
                      >
                        {processingId !== req.id && <Check size={14} strokeWidth={3} />}
                        <span>Approve Entry</span>
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 italic pr-2">Decision Logged</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}