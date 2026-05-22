import Link from "next/link";
import { MoveRight } from "lucide-react";
import { Button } from "@/shared/ui/button";

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col justify-center items-center text-center p-6 relative overflow-hidden">
      
      {/* Structural Graphic Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl space-y-6 relative z-10">
        <span className="px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 font-black text-[10px] uppercase tracking-widest inline-block">
          Next-Generation LMS
        </span>
        
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
          Master Modern Tech <br/> 
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            One Block At A Time
          </span>
        </h1>

        <p className="text-slate-400 font-medium text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Create, consume, and rate educational tracks on a highly adaptive MERN-driven streaming environment interface context.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup" passHref className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto px-8 py-4 font-black rounded-2xl shadow-xl shadow-violet-900/30 text-sm">
              Get Started Free <MoveRight size={16} className="ml-2 inline" />
            </Button>
          </Link>
          <Link href="/courses" passHref className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto px-8 py-4 font-black rounded-2xl text-slate-300 bg-slate-900 hover:bg-slate-800 border-slate-800 text-sm">
              Explore Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}