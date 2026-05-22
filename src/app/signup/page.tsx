"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { UserPlus, GraduationCap, ShieldAlert } from "lucide-react";

import { supabase } from "@/lib/supabase-client";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { UserRole } from "@/types/global";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
          },
        },
      });

      if (error) throw error;

      toast.success("Registration complete! Check your email to verify.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Failed to finalize structural credentials registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4">
      <div className="w-full max-w-md bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/40 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-400 font-medium">Join our cross-functional performance pipeline</p>
        </div>

        {/* Custom Segmented Role Switch Matrix Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              role === "student" ? "bg-white text-violet-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <GraduationCap size={16} /> Student
          </button>
          <button
            type="button"
            onClick={() => setRole("instructor")}
            className={`py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              role === "instructor" ? "bg-white text-violet-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldAlert size={15} /> Instructor
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1">Email Address</label>
            <Input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1">Password</label>
            <Input
              type="password"
              required
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" variant="primary" isLoading={loading} className="w-full py-4 text-sm font-black rounded-2xl">
            {!loading && <UserPlus size={16} className="mr-2 inline" />}
            Register Account
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}