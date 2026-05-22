"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: "violet" | "green" | "amber" | "blue" | "red" | "slate";
  variant?: "primary" | "secondary" | "success" | "warning" | "info";
  trend?: {
    direction: "up" | "down";
    value: number;
  };
  children?: ReactNode;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "violet",
  variant = "primary",
  trend,
  children,
}: StatCardProps) {
  const iconColorClasses = {
    violet: "bg-violet-100 text-violet-600",
    green: "bg-green-100 text-green-600",
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
    slate: "bg-slate-100 text-slate-600",
  };

  const variantGradients = {
    primary: "from-slate-50 to-slate-100/50",
    secondary: "from-slate-100 to-slate-50",
    success: "from-green-50 to-emerald-50/50",
    warning: "from-amber-50 to-orange-50/50",
    info: "from-blue-50 to-cyan-50/50",
  };

  return (
    <div className={`rounded-[2rem] border border-slate-200 bg-gradient-to-br ${variantGradients[variant]} p-6 transition-all hover:shadow-md`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-black">
            {title}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl lg:text-4xl font-black text-slate-900">
              {value}
            </span>
            {trend && (
              <span className={`text-xs font-black uppercase tracking-wider ${
                trend.direction === "up" ? "text-green-600" : "text-red-600"
              }`}>
                {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${iconColorClasses[iconColor]}`}>
            <Icon size={24} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Footer content */}
      {children && (
        <div className="border-t border-slate-200/50 pt-4 mt-4">
          {children}
        </div>
      )}
    </div>
  );
}
