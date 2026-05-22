"use client";

import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Transparent Framework</h1>
          <p className="text-sm text-slate-400 font-medium">Acquire full platform operational utilities with zero hidden paywalls.</p>
        </div>

        <div className="bg-slate-900 text-white rounded-[3rem] p-8 md:p-12 border border-slate-950 shadow-xl relative overflow-hidden max-w-md mx-auto">
          <div className="absolute top-0 right-0 p-4 bg-violet-600 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
            Standard Plan
          </div>
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-black text-xl tracking-tight text-slate-200">Open Classroom Access</h3>
              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-xs font-bold text-slate-400">/ forever</span>
              </div>
            </div>

            <hr className="border-slate-800" />

            <ul className="space-y-3.5 text-xs font-medium text-slate-300">
              <li className="flex items-center gap-2"><Check size={14} className="text-violet-400" /> Unlimited course ingestion consumption</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-violet-400" /> Interactive HTML5 video streaming players</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-violet-400" /> Secure user role profiles selection mapping</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-violet-400" /> Complete tracking dashboard systems</li>
            </ul>

            <Link href="/signup" passHref className="block pt-4">
              <Button variant="primary" className="w-full py-4 rounded-xl text-sm font-black shadow-lg shadow-violet-900/20">
                Initialize Free Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}