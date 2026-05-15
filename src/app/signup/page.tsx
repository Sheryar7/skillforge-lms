"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, GraduationCap, School } from "lucide-react"; // Nice icons for the roles
import Spinner from "@/components/Spinner";
import { supabase } from "@/lib/supabase-client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "instructor">("student"); // Default to student
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !fullName) {
      return alert("Please fill all fields");
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role, // This sends the user's choice to the database trigger
          username: email.split("@")[0],
        },
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    alert("Account created successfully!");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD] p-4">
      <div className="bg-white border border-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Create Account</h1>
          <p className="text-slate-500 text-sm">Join Sherry LMS as a student or teacher</p>
        </div>

        <div className="space-y-5">
          {/* ROLE SELECTOR */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setRole("student")}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                role === "student" 
                ? "border-purple-600 bg-purple-50 text-purple-600" 
                : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
              }`}
            >
              <GraduationCap size={24} className="mb-2" />
              <span className="font-bold text-sm">Student</span>
            </button>

            <button
              onClick={() => setRole("instructor")}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                role === "instructor" 
                ? "border-purple-600 bg-purple-50 text-purple-600" 
                : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
              }`}
            >
              <School size={24} className="mb-2" />
              <span className="font-bold text-sm">Instructor</span>
            </button>
          </div>

          {/* FULL NAME */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">Full Name</label>
            <input
              type="text"
              placeholder="Sherry Khan"
              value={fullName}
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl hover:bg-purple-700 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
          >
            {loading ? <Spinner /> : "Create Account"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-sm text-slate-500">
            Already have an account? 
            <Link href="/login" className="text-purple-600 font-bold ml-1">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}