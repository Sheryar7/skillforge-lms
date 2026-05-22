"use client";

import { useState } from "react";
import { User, Mail, Lock, UserPlus, Shield, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Spinner from "@/shared/components/Spinner";
import { signupAction } from "../actions/signup";
import { UserRole } from "../types/auth.types";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signupAction(email, password, fullName, role);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Account registered successfully!");
      
      if (result.role === "instructor") {
        router.push("/dashboard/instructor");
      } else {
        router.push("/dashboard/student");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account profile.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 font-bold outline-none transition-all";

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-[3.5rem] border-2 border-slate-100 shadow-2xl shadow-violet-100 animate-in zoom-in-95 duration-200">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3">
          <div className="p-2 bg-violet-600 rounded-xl text-white">
            <UserPlus size={24} />
          </div>
          Create Account
        </h2>
        <p className="text-slate-500 font-medium mt-2">Get started with your custom profile portal</p>
      </div>

      {/* Custom Dual-Path Strategy Toggle Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          type="button"
          onClick={() => !loading && setRole("student")}
          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 font-black text-sm transition-all ${
            role === "student"
              ? "border-violet-600 bg-violet-50 text-violet-600 shadow-sm"
              : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
          }`}
          disabled={loading}
        >
          <GraduationCap size={20} />
          <span>I&apos;m a Student</span>
        </button>
        <button
          type="button"
          onClick={() => !loading && setRole("instructor")}
          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 font-black text-sm transition-all ${
            role === "instructor"
              ? "border-violet-600 bg-violet-50 text-violet-600 shadow-sm"
              : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
          }`}
          disabled={loading}
        >
          <Shield size={20} />
          <span>I&apos;m an Instructor</span>
        </button>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        {/* Full Name input field */}
        <div className="space-y-1 relative">
          <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <User size={18} />
            </div>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Sherry Khan"
              className={inputStyles}
              disabled={loading}
            />
          </div>
        </div>

        {/* Email input field */}
        <div className="space-y-1 relative">
          <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sherry@example.com"
              className={inputStyles}
              disabled={loading}
            />
          </div>
        </div>

        {/* Password input field */}
        <div className="space-y-1 relative">
          <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1">Secure Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputStyles}
              disabled={loading}
            />
          </div>
        </div>

        {/* Form Submit wrapper loop button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-5 bg-violet-600 text-white rounded-2xl font-black shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Spinner />
              <span>Building Profile Entry...</span>
            </>
          ) : (
            "Complete Account Setup"
          )}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-slate-500 font-medium text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-600 font-black hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}