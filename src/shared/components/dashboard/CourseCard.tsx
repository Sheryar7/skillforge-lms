"use client";

import Link from "next/link";

interface CourseCardProps {
  title: string;
  description: string;
  progress: number;
  metricLabel: string;
  metricValue: string | number;
  href: string;
  badge?: string;
}

export default function CourseCard({
  title,
  description,
  progress,
  metricLabel,
  metricValue,
  href,
  badge,
}: CourseCardProps) {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-black">{badge || "Active"}</span>
          </div>
          <h3 className="mt-4 text-xl font-black text-slate-900 tracking-tight">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">{metricLabel}</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{metricValue}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Course progress</span>
          <span className="font-bold text-slate-900">{progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-violet-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <Link
          href={href}
          className="inline-flex items-center rounded-2xl bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-700"
        >
          Continue
        </Link>
        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{progress === 100 ? "Complete" : "In progress"}</span>
      </div>
    </div>
  );
}
