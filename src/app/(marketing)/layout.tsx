"use client";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Marketing Content Flow Area */}
      <div className="flex-1 animate-in fade-in duration-300">
        {children}
      </div>
      
      {/* Minimalist Structural Footer */}
      <footer className="py-8 text-center text-xs font-bold text-slate-400 bg-slate-50 border-t border-slate-100">
        © {new Date().getFullYear()} Sherry LMS Platform framework nodeset.
      </footer>
    </div>
  );
}
