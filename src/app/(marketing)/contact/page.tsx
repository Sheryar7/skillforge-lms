"use client";

import { Mail, MessageSquare } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import toast from "react-hot-toast";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message compiled! Our systems will update shortly.");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4">
      <div className="max-w-md mx-auto bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/40 space-y-6">
        <div className="text-center space-y-1.5">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl inline-block">
            <Mail size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Contact</h2>
          <p className="text-xs text-slate-400 font-medium">Submit architectural tickets or integration questions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1">Full Identity</label>
            <Input required placeholder="Sherry Khan" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1">Email Node</label>
            <Input type="email" required placeholder="you@example.com" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1">Message Context</label>
            <textarea 
              required 
              rows={4}
              placeholder="Detail your system feedback mapping requirements here..."
              className="w-full p-4 bg-white border-2 border-slate-100 text-slate-900 placeholder-slate-400 rounded-2xl font-medium text-sm outline-none focus:border-violet-500 transition-all resize-none"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full py-4 text-sm font-black rounded-2xl">
            <MessageSquare size={16} className="mr-2 inline" /> Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}