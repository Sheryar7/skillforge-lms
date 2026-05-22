"use client";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  accent?: "violet" | "emerald" | "amber" | "sky";
}

const accentStyles: Record<string, string> = {
  violet: "bg-violet-50 text-violet-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  sky: "bg-sky-50 text-sky-700",
};

export default function StatCard({
  label,
  value,
  description,
  icon: Icon,
  accent = "violet",
}: StatCardProps) {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-black">{label}</p>
          <p className="text-3xl font-black text-slate-900">{value}</p>
        </div>
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${accentStyles[accent]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{description}</p>
    </div>
  );
}
