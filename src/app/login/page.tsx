"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // LOGIN FUNCTION
  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please fill all fields");
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD] p-4">

      {/* Decorative Blobs */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-blue-100/60 rounded-full blur-3xl -z-10" />
      <div className="fixed -bottom-10 -left-10 w-80 h-80 bg-purple-100/60 rounded-full blur-3xl -z-10" />

      <div className="bg-white border border-white p-8 rounded-[2rem] shadow-2xl shadow-blue-100/50 w-full max-w-md">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
            Welcome Back
          </h1>

          <p className="text-slate-500 text-sm">
            Login to continue to your LMS dashboard
          </p>
        </div>

        <div className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">
              Email Address
            </label>

            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center min-h-[60px]"
          >
            {loading ? <Spinner /> : "Login"}
          </button>

        </div>

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-slate-50 text-center">

          <p className="text-sm text-slate-500">
            Don&apos;t have an account?

            <Link
              href="/signup"
              className="text-purple-600 hover:text-purple-800 transition-colors duration-200 font-bold ml-1"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>
    </div>
  );
}