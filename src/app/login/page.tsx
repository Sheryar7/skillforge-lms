"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";

import { supabase } from "@/lib/supabase-client";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Welcome back!");
      
      // Dynamic fallback redirect pattern based on user metadata/profiles
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Invalid authentication credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4">
      <div className="w-full max-w-md bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/40 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In</h2>
          <p className="text-xs text-slate-400 font-medium">Access your global learning ecosystem dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" variant="primary" isLoading={loading} className="w-full py-4 text-sm font-black rounded-2xl">
            {!loading && <LogIn size={16} className="mr-2 inline" />}
            Sign In
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400 font-medium">
            Don't have an account?{" "}
            <Link href="/signup" className="text-violet-600 font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}