"use client";

import type { LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
  label: string;
  value: string;
  meta: string;
  icon: LucideIcon;
  accent?: "violet" | "emerald" | "amber" | "sky";
}

const accentColors: Record<string, string> = {
  violet: "bg-violet-50 text-violet-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  sky: "bg-sky-50 text-sky-700",
};

export default function AnalyticsCard({
  label,
  value,
  meta,
  icon: Icon,
  accent = "sky",
}: AnalyticsCardProps) {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md duration-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-black">{label}</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
        </div>
        <div className={`inline-flex h-11 w-11 items-center justify-center rounded-3xl ${accentColors[accent]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">{meta}</p>
    </div>
  );
}
