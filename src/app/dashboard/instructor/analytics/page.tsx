"use client";

import { BarChart3, ArrowUpRight, DollarSign, Award } from "lucide-react";

export default function InstructorAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Performance Analytics Matrix</h1>
        <p className="text-xs text-slate-400 font-medium">Inspect comprehensive engagement patterns across video pipelines</p>
      </div>

      {/* Grid Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-violet-50 rounded-2xl text-violet-600">
              <DollarSign size={22} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-900">$0.00</h4>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-0.5">Gross Revenue Balance</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400 flex items-center gap-0.5">0% <ArrowUpRight size={14} /></span>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-fuchsia-50 rounded-2xl text-fuchsia-600">
              <BarChart3 size={22} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-900">0 mins</h4>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-0.5">Total Content Streaming Retention</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400 flex items-center gap-0.5">0% <ArrowUpRight size={14} /></span>
        </div>
      </div>
    </div>
  );
}