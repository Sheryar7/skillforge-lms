"use client";

import { useState } from "react";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

// Importing your clean shared design tokens
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { loginAction } from "../actions/login";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginAction(email, password);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Welcome back!");
      
      // Smart role-based dashboard redirection routing
      if (result.role === "instructor") {
        router.push("/dashboard/instructor");
      } else {
        router.push("/dashboard/student");
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid email or credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-[3.5rem] border-2 border-slate-100 shadow-2xl shadow-violet-100 animate-in zoom-in-95 duration-200">
      <div className="text-center mb-8">
        <div className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3">
          <div className="p-2 bg-violet-600 rounded-xl text-white">
            <LogIn size={24} />
          </div>
          <h2>Welcome Back</h2>
        </div>
        <p className="text-slate-500 font-medium mt-2">Sign in to continue your learning journey</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {/* Email input field using shared UI primitive */}
        <div className="relative">
          <div className="absolute top-[38px] left-4 text-slate-400 z-10 pointer-events-none">
            <Mail size={18} />
          </div>
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sherry@example.com"
            disabled={loading}
            className="pl-12" // Shifts text to the right for the absolute icon layout
          />
        </div>

        {/* Password input field using shared UI primitive with Toggle Visibility */}
        <div className="relative">
          <div className="absolute top-[38px] left-4 text-slate-400 z-10 pointer-events-none">
            <Lock size={18} />
          </div>
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="pl-12 pr-12" // Shifts text spacing on both sides for layout balance
          />
          <button
            type="button"
            tabIndex={-1}
            disabled={loading}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[38px] right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Submit button using shared UI button with dynamic loading state built-in */}
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          className="w-full py-5 text-base"
        >
          {loading ? "Authenticating Session..." : "Sign In to Platform"}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-slate-500 font-medium text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-violet-600 font-black hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}