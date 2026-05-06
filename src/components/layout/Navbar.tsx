"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-purple-600">
          Sherry LMS
        </Link>

        {/* Links */}
        <div className="flex items-center gap-3">

          <Link
            href="/"
            className="px-4 py-2 text-gray-600 hover:text-purple-600 transition"
          >
            Home
          </Link>

          <Link
            href="/login"
            className="px-4 py-2 text-gray-600 hover:text-purple-600 transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Signup
          </Link>

        </div>
      </div>
    </nav>
  );
}