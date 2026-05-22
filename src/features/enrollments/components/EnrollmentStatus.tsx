"use client";

import { EnrollmentStatus as StatusType } from "../types/enrollment.types";

interface EnrollmentStatusProps {
  status: StatusType;
}

export default function EnrollmentStatus({ status }: EnrollmentStatusProps) {
  // Safe layout mappings fallback style tokens
  const mapping: Record<StatusType, string> = {
    approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100 animate-pulse"
  };

  // Safe fallback configurations if status falls out of expected types matrix array
  const currentStyles = mapping[status] || "bg-slate-50 text-slate-500 border-slate-100";
  const displayText = status || "unknown";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border ${currentStyles}`}>
      {displayText}
    </span>
  );
}