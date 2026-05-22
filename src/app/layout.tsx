import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/shared/components/Navbar";
import { AuthProvider } from "@/providers/AuthProvider";

import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sherry LMS",
  description:
    "Modern SaaS Learning Management System built with Next.js and Supabase.",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {/* GLOBAL BACKGROUND */}
        <div className="fixed inset-0 -z-50 overflow-hidden bg-white">
          {/* Subtle colorful ambient glows */}
          <div className="absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-violet-200/40 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-200/40 blur-3xl" />

          {/* Clean, visible, professional grid layout */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px] opacity-70" />
        </div>

        {/* NAVBAR */}
        <AuthProvider>
          <Navbar />

          {/* PAGE */}
          <main>{children}</main>

          {/* TOASTER */}
          <Toaster
            richColors
            closeButton
            position="top-right"
          />
        </AuthProvider>
      </body>
    </html>
  );
}