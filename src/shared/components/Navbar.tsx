"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase-client";

import LogoutButton from "@/features/auth/components/LogoutButton";

import type { RealtimeChannel, User } from "@supabase/supabase-js";
import {
  ArrowRight,
  BookOpen,
  Home,
  LayoutDashboard,
  Menu,
  User as UserIcon,
  X,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [profile, setProfile] = useState({
    userId: "",
    name: "",
    avatar: "",
  });

  // AUTH SESSION

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // PROFILE FETCH & REAL-TIME SYNC

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setProfile({
        userId: user.id,
        name: data?.full_name || "",
        avatar: data?.avatar_url || "",
      });
    };

    loadProfile();

    const channelName = `navbar-profile-${user.id}`;
    const channel: RealtimeChannel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setProfile({
            userId: user.id,
            name: payload.new.full_name || "",
            avatar:
              payload.new.avatar_url || "",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      isActive: pathname.startsWith("/dashboard"),
    },
  ];

  const activeProfile =
    user && profile.userId === user.id
      ? profile
      : { userId: "", name: "", avatar: "" };

  const navLinkClass = (isActive: boolean) =>
    cn(
      "group inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-black text-white transition-all duration-200",
      "bg-slate-950 hover:bg-slate-800 hover:text-sky-400",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
      isActive && "bg-slate-900 text-white shadow-inner shadow-black/30 hover:bg-slate-800 hover:text-sky-400"
    );

  const actionLinkClass =
    "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

  const profileInitial = activeProfile.name?.charAt(0) || user?.email?.charAt(0) || "";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950 shadow-[0_16px_48px_rgba(2,6,23,0.18)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-600 font-black text-white shadow-lg shadow-violet-950/30">
            S
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-black text-white sm:text-lg">
              Sherry LMS
            </h1>

            <p className="hidden text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:block">
              Learning Platform
            </p>
          </div>
        </Link>

        <div className="order-3 flex w-full items-center justify-center gap-2 rounded-full border border-slate-800 bg-slate-950/80 p-1 sm:order-none sm:w-auto sm:justify-start">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClass(item.isActive)}
              >
                <Icon className="shrink-0 transition-colors duration-200 group-hover:text-sky-400" size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* NAV */}
        <div className="hidden items-center gap-2 md:flex">
          {!user ? (
            <>
              <Link
                href="/courses"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-5 text-sm font-black text-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-400 hover:shadow-lg hover:shadow-slate-950/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <BookOpen size={16} />
                Go to Courses
              </Link>

              <Link
                href="/signup"
                className={actionLinkClass}
              >
                Start Trial
                <ArrowRight size={16} />
              </Link>
            </>
          ) : (
            <div className="ml-2 flex items-center gap-3 border-l border-slate-800 pl-4">
              <Link
                href="/courses"
                className={actionLinkClass}
              >
                <BookOpen size={16} />
                Go to Courses
              </Link>

              <LogoutButton className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-black text-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-400/50 hover:bg-slate-800 hover:text-rose-300" />

              <Link
                href="/dashboard/profile"
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                aria-label="Open profile"
              >
                <div className="relative h-11 w-11 overflow-hidden rounded-full border border-slate-700 bg-slate-900 shadow-sm">

                  {activeProfile.avatar ? (
                    <Image
                      src={activeProfile.avatar}
                      alt="Profile"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-black uppercase text-sky-400">
                      {profileInitial || (
                        <UserIcon size={18} />
                      )}
                    </div>
                  )}

                </div>
              </Link>
            </div>
          )}

        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-white shadow-sm transition-colors hover:bg-slate-800 hover:text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 md:hidden"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 shadow-2xl shadow-slate-950/40 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  navLinkClass(item.isActive),
                  "justify-start rounded-2xl px-4 py-3"
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}

            {!user ? (
              <>
                <Link
                  href="/courses"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-black text-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-400"
                >
                  <BookOpen size={18} />
                  Go to Courses
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl"
                >
                  Start Trial
                  <ArrowRight size={18} />
                </Link>
              </>
            ) : (
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex min-w-0 items-center gap-3 rounded-2xl px-2 py-1 text-white"
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-slate-700 bg-slate-900">
                    {activeProfile.avatar ? (
                      <Image
                        src={activeProfile.avatar}
                        alt="Profile"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-black uppercase text-sky-400">
                        {profileInitial || (
                          <UserIcon size={18} />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-white">
                      {activeProfile.name || "Profile"}
                    </p>
                    <p className="truncate text-xs font-semibold text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </Link>

                <LogoutButton className="shrink-0 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-black text-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-400/50 hover:bg-slate-800 hover:text-rose-300" />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
