import { HelpCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export default function EmptyState({ title, description, icon: Icon = HelpCircle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 bg-white rounded-[2.5rem] py-20 max-w-2xl mx-auto">
      <div className="p-4 bg-slate-50 rounded-full text-slate-400 mb-4 border border-slate-100/50 shadow-sm">
        <Icon size={36} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
      <p className="text-slate-400 font-medium text-sm max-w-sm mt-1.5 leading-relaxed">{description}</p>
    </div>
  );
}