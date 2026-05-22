"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

import {
  User,
  Shield,
  Bell,
  Lock,
  Save,
  Mail,
  Settings,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [resetLoading, setResetLoading] =
    useState(false);

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    role: "",
  });

  const [notifications, setNotifications] =
    useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile({
        full_name: data?.full_name || "",
        email: data?.email || user.email || "",
        role: data?.role || "student",
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to load profile.", {
        id: "profile-error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (saving) return;

    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          email: profile.email,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success(
        "Profile updated successfully.",
        {
          id: "profile-success",
        }
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update profile.",
        {
          id: "profile-update-error",
        }
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (resetLoading) return;

    try {
      setResetLoading(true);

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          profile.email,
          {
            redirectTo:
              "http://localhost:3000/reset-password",
          }
        );

      if (error) throw error;

      toast.success(
        "Password reset email sent.",
        {
          id: "password-reset-success",
        }
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to send password reset email.",
        {
          id: "password-reset-error",
        }
      );
    } finally {
      setResetLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2
            className="animate-spin"
            size={18}
          />
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your LMS account, profile
            details, security preferences, and
            platform settings.
          </p>
        </div>

        <button
          onClick={() => {
            if (!saving) {
              handleUpdateProfile();
            }
          }}
          disabled={saving}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* GRID */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-6 xl:col-span-2">
          {/* PROFILE */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <User size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Profile Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Update your public account
                    details
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      full_name: e.target.value,
                    })
                  }
                  className="h-12 text-slate-500 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      email: e.target.value,
                    })
                  }
                  className="h-12 text-slate-500 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Account Role
                </label>

                <input
                  type="text"
                  disabled
                  value={profile.role}
                  className="h-12 text-slate-500 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm capitalize text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* SECURITY */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Shield size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Security Settings
                  </h2>

                  <p className="text-sm text-slate-500">
                    Protect your account and
                    authentication
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex flex-col gap-5 rounded-xl border border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-medium text-slate-900">
                    Password Reset
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Send a secure password reset
                    email to your registered
                    account.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (!resetLoading) {
                      handlePasswordReset();
                    }
                  }}
                  disabled={resetLoading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resetLoading ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      Reset Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Bell size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Notifications
                  </h2>

                  <p className="text-sm text-slate-500">
                    Configure email and platform
                    alerts
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-5">
                <div>
                  <h3 className="font-medium text-slate-900">
                    Email Notifications
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Receive course activity and
                    enrollment updates.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setNotifications(
                      !notifications
                    )
                  }
                  className={`relative h-7 w-12 rounded-full transition ${
                    notifications
                      ? "bg-violet-600"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      notifications
                        ? "right-1"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* ACCOUNT CARD */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-3xl font-bold text-violet-700">
                {profile.full_name?.charAt(0) ||
                  "U"}
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {profile.full_name}
              </h2>

              <p className="text-sm text-slate-500">
                {profile.email}
              </p>

              <span className="mt-4 rounded-full bg-violet-100 px-4 py-1 text-xs font-semibold capitalize text-violet-700">
                {profile.role}
              </span>
            </div>
          </div>

          {/* PLATFORM INFO */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <Settings size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Platform Information
                </h2>

                <p className="text-sm text-slate-500">
                  Current LMS environment
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Platform
                </span>

                <span className="text-sm font-medium text-slate-900">
                  Sherry LMS
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Version
                </span>

                <span className="text-sm font-medium text-slate-900">
                  v1.0.0
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Authentication
                </span>

                <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Secure
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Email Status
                </span>

                <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600">
                  <Mail size={14} />
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}