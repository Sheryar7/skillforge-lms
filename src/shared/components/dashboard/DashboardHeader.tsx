"use client";

import Link from "next/link";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  badge: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function DashboardHeader({
  title,
  subtitle,
  badge,
  ctaLabel,
  ctaHref,
}: DashboardHeaderProps) {
  return (
    <div className="rounded-[2.5rem] border border-slate-100 bg-slate-950/95 p-8 shadow-2xl shadow-slate-900/5 backdrop-blur-xl text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(139,92,246,0.2),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_28%)] pointer-events-none" />
      <div className="relative grid gap-6 lg:grid-cols-[1.3fr_0.7fr] items-center">
        <div className="space-y-4">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-slate-200 font-bold shadow-sm">
            {badge}
          </span>
          <h1 className="text-4xl font-black tracking-tight text-white">{title}</h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">{subtitle}</p>
        </div>

        {ctaHref ? (
          <div className="flex justify-start lg:justify-end">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-3xl bg-orange-500 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-950 shadow-lg shadow-violet-500/10 transition hover:-translate-y-0.5 hover:bg-orange-700"
            >
              {ctaLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
