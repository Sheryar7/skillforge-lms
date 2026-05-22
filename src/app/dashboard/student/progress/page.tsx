"use client";

import { BarChart3, Award, CheckCircle } from "lucide-react";

export default function StudentProgressPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Progress Performance Analytics</h1>
        <p className="text-xs text-slate-400 font-medium">Track completion tracking records across active video endpoints</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
          <div className="p-4 bg-violet-50 rounded-2xl text-violet-600"><CheckCircle size={22} /></div>
          <div>
            <h4 className="text-xl font-black text-slate-900">0%</h4>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-0.5">Average Syllabus Completion</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600"><Award size={22} /></div>
          <div>
            <h4 className="text-xl font-black text-slate-900">0</h4>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-0.5">Chapters Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}