"use client";

import { Info, Users, ShieldCheck, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="p-3 bg-violet-600 text-white rounded-2xl inline-block shadow-lg shadow-violet-100">
            <Info size={24} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Our Mission Matrix</h1>
          <p className="text-sm text-slate-400 font-medium max-w-xl mx-auto">
            Breaking down complex tech architectures into digestible, structural curriculum modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
            <div className="text-violet-600"><Users size={20} /></div>
            <h3 className="font-black text-slate-900 text-sm">Community Driven</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Built by engineers, for engineers looking to fast-track real world stack competencies.</p>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
            <div className="text-violet-600"><Zap size={20} /></div>
            <h3 className="font-black text-slate-900 text-sm">Modular Blocks</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">No fluff. Straight forward learning tracks structured systematically by domain authors.</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
            <div className="text-violet-600"><ShieldCheck size={20} /></div>
            <h3 className="font-black text-slate-900 text-sm">Verified Paths</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Every video file and resource check node is actively monitored for complete sync accuracy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}