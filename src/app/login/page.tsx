"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email Input, 2: OTP Input
  const router = useRouter();

  // Step 1: Send the 6-digit code to the user's email
  const handleSendOTP = async () => {
    if (!email) return alert("Please enter your email");
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Automatically creates a user if they don't exist
        shouldCreateUser: true, 
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      setStep(2);
      setLoading(false);
    }
  };

  // Step 2: Verify the 6-digit code
  const handleVerifyOTP = async () => {
    if (!otp) return alert("Please enter the verification code");

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
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
            {step === 1 ? "Welcome Back" : "Verify Email"}
          </h1>
          <p className="text-slate-500 text-sm">
            {step === 1 
              ? "Sign in or create an account with a code" 
              : `We've sent a 6-digit code to ${email}`}
          </p>
        </div>

        <div className="space-y-5">
          {step === 1 ? (
            /* Email Input State */
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
          ) : (
            /* OTP Input State */
            <div>
              <div className="flex justify-between items-center ml-1 mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  6-Digit Code
                </label>
                <span 
                  className="text-[10px] font-bold text-purple-500 cursor-pointer hover:text-purple-700"
                  onClick={() => setStep(1)}
                >
                  CHANGE EMAIL?
                </span>
              </div>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otp}
                className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-center text-xl tracking-widest font-mono"
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}

          <button
            onClick={step === 1 ? handleSendOTP : handleVerifyOTP}
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center min-h-[60px]"
          >
            {loading ? <Spinner /> : step === 1 ? "Send Code" : "Verify & Sign In"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-sm text-slate-500">
            {step === 1 ? "By signing in, you agree to our Terms" : "Didn't receive a code?"}
            {step === 2 && (
              <span
                className="text-purple-600 cursor-pointer hover:text-purple-800 transition-colors duration-200 font-bold ml-1"
                onClick={handleSendOTP}
              >
                Resend
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}