"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className={cn(
        "rounded-lg bg-red-500 px-3 py-1 text-white",
        className
      )}
    >
      Logout
    </button>
  );
}
