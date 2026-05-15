"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import LogoutButton from "./LogoutButton";
import { User } from "@supabase/supabase-js";
import { User as UserIcon } from "lucide-react";

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState({ name: "", avatar: "" });
    const pathname = usePathname();

    useEffect(() => {
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                fetchProfile(currentUser.id);

                // SUBSCRIBE ONLY TO THE CURRENT USER'S PROFILE
                const channel = supabase
                    .channel(`navbar-profile-${currentUser.id}`)
                    .on(
                        "postgres_changes",
                        {
                            event: "UPDATE",
                            schema: "public",
                            table: "profiles",
                            filter: `id=eq.${currentUser.id}` // IMPORTANT
                        },
                        (payload: any) => {
                            setProfile({
                                name: payload.new.full_name || "",
                                avatar: payload.new.avatar_url || ""
                            });
                        }
                    )
                    .subscribe();

                return () => { supabase.removeChannel(channel); };
            }
        };

        const fetchProfile = async (userId: string) => {
            const { data } = await supabase
                .from("profiles")
                .select("full_name, avatar_url")
                .eq("id", userId)
                .single(); // Use single to ensure we get exactly one

            if (data) {
                setProfile({
                    name: data.full_name || "",
                    avatar: data.avatar_url || ""
                });
            }
        };

        getInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const newUser = session?.user ?? null;
            setUser(newUser);
            if (newUser) fetchProfile(newUser.id);
            else setProfile({ name: "", avatar: "" }); // Clear on logout
        });

        return () => subscription.unsubscribe();
    }, []);

    const isDashboardPage = pathname.startsWith("/dashboard");

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="mx-auto px-8 py-3 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-xl">S</div>
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold text-gray-800">Sherry <span className="text-violet-600">LMS</span></span>
                        <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-widest">Learning Platform</span>
                    </div>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-5 mr-4">
                        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-violet-600 transition">Home</Link>
                        {user && !isDashboardPage && (
                            <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-violet-600 transition">Dashboard</Link>
                        )}
                    </div>

                    {!user ? (
                        <Link href="/login" className="px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl">Get Started</Link>
                    ) : (
                        <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
                            <LogoutButton />
                            <Link href="/dashboard/profile">
                                <div className="w-10 h-10 rounded-full bg-violet-100 border-2 border-violet-400 flex items-center justify-center overflow-hidden">
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-violet-700 font-bold">{profile.name?.charAt(0) || <UserIcon size={16} />}</span>
                                    )}
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}