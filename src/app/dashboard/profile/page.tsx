"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import Spinner from "@/components/Spinner";
import { Mail, Shield, Edit3, X, Save, BookOpen, Users, GraduationCap, Camera } from "lucide-react";

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [userEmail, setUserEmail] = useState<string | undefined>("");
    const [stats, setStats] = useState({ primary: 0, secondary: 0 });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const [profile, setProfile] = useState({
        full_name: "",
        username: "",
        bio: "",
        role: "",
        avatar_url: "",
    });

    useEffect(() => {
        const getProfileAndStats = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                setUserEmail(user.email);

                // 1. Fetch Profile Data
                const { data: profileData, error: profileError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .maybeSingle();

                if (profileError) throw profileError;

                if (profileData) {
                    const currentRole = profileData.role || "student";
                    setProfile({
                        full_name: profileData.full_name || "",
                        username: profileData.username || "",
                        bio: profileData.bio || "",
                        role: currentRole,
                        avatar_url: profileData.avatar_url || "",
                    });

                    // 2. Fetch Stats based on Role
                    try {
                        if (currentRole === "instructor") {
                            const { data, error } = await supabase
                                .from("courses")
                                .select("id")
                                .eq("instructor_id", user.id);
                            if (!error) setStats({ primary: data?.length || 0, secondary: 0 });
                        } else {
                            // FIXED: Changed 'student_id' to 'user_id' to match your database schema
                            const { data, error } = await supabase
                                .from("enrollments")
                                .select("id")
                                .eq("user_id", user.id);

                            if (!error) setStats({ primary: data?.length || 0, secondary: 0 });
                        }
                    } catch (e) {
                        console.error("Stats fetch error:", e);
                    }
                }
            } catch (error) {
                console.error("Critical error fetching profile:", error);
            } finally {
                setFetching(false);
            }
        };
        getProfileAndStats();
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            let finalAvatarUrl = profile.avatar_url;

            if (selectedFile) {
                const fileExt = selectedFile.name.split('.').pop();
                const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('course-images')
                    .upload(filePath, selectedFile);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('course-images')
                    .getPublicUrl(filePath);
                finalAvatarUrl = urlData.publicUrl;
            }

            const { error } = await supabase.from("profiles").upsert({
                id: user.id,
                full_name: profile.full_name,
                username: profile.username,
                bio: profile.bio,
                avatar_url: finalAvatarUrl,
            });

            if (error) throw error;

            setProfile(prev => ({ ...prev, avatar_url: finalAvatarUrl }));
            setSelectedFile(null);
            setPreviewUrl("");
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            setSelectedFile(null);
            setPreviewUrl("");
        }
        setIsEditing(!isEditing);
    };

    if (fetching) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div className="max-w-2xl animate-in fade-in duration-500 pb-10">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-violet-600/5 to-purple-500/5 -z-0" />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-5">
                            <div className="relative group">
                                <div className="w-20 h-20 rounded-3xl bg-violet-600 overflow-hidden flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-violet-200">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        profile.full_name?.charAt(0).toUpperCase() || "U"
                                    )}
                                </div>

                                {isEditing && (
                                    <>
                                        <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 p-2 bg-white text-violet-600 rounded-xl cursor-pointer hover:scale-110 transition-all shadow-lg border border-slate-100">
                                            <Camera size={16} />
                                        </label>
                                        <input
                                            type="file"
                                            id="avatar-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            disabled={loading}
                                        />
                                    </>
                                )}
                            </div>

                            <div>
                                <h1 className="text-2xl font-black text-slate-800">{profile.full_name || "New User"}</h1>
                                <p className="text-slate-400 font-medium italic">@{profile.username || "username"}</p>
                            </div>
                        </div>

                        <button
                            onClick={toggleEdit}
                            className={`p-3 rounded-2xl transition-all z-20 ${isEditing ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-violet-50 text-violet-600 hover:bg-violet-100'}`}
                        >
                            {isEditing ? <X size={20} /> : <Edit3 size={20} />}
                        </button>
                    </div>

                    {!isEditing && (
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-violet-50/50 p-4 rounded-3xl border border-violet-100">
                                <div className="flex items-center gap-3 mb-1">
                                    {profile.role === 'instructor' ? <Users size={18} className="text-violet-600" /> : <BookOpen size={18} className="text-violet-600" />}
                                    <span className="text-[10px] uppercase font-bold text-violet-400 tracking-widest">
                                        {profile.role === 'instructor' ? 'Total Students' : 'Enrolled Courses'}
                                    </span>
                                </div>
                                <p className="text-2xl font-black text-slate-800 ml-7">{stats.primary}</p>
                            </div>
                            <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                                <div className="flex items-center gap-3 mb-1">
                                    <GraduationCap size={18} className="text-slate-400" />
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Learning Hours</span>
                                </div>
                                <p className="text-2xl font-black text-slate-800 ml-7">0</p>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-6">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm"><Mail size={18} /></div>
                            <div className="flex-1">
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</p>
                                <p className="text-slate-700 font-semibold">{userEmail}</p>
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-violet-500 tracking-wider ml-1 mb-2 block">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        className="w-full p-4 rounded-2xl border-2 text-slate-800 border-slate-200 bg-white focus:border-violet-600 focus:outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-violet-500 tracking-wider ml-1 mb-2 block">Username</label>
                                    <input
                                        type="text"
                                        value={profile.username}
                                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                        className="w-full p-4 rounded-2xl border-2 text-slate-800 border-slate-200 bg-white focus:border-violet-600 focus:outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-violet-500 tracking-wider ml-1 mb-2 block">Bio</label>
                                    <textarea
                                        rows={3}
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        className="w-full p-4 rounded-2xl border-2 text-slate-800 border-slate-200 bg-white focus:border-violet-600 focus:outline-none transition-all resize-none"
                                    />
                                </div>
                                <button onClick={handleUpdate} disabled={loading} className="w-full bg-violet-600 text-white py-4 rounded-2xl font-bold hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                                    {loading ? <Spinner /> : <><Save size={18} /> Save Changes</>}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Shield size={18} /></div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Account Role</p>
                                        <p className="text-slate-700 font-bold capitalize">{profile.role}</p>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-violet-50/30 border border-violet-100/50">
                                    <p className="text-[10px] uppercase font-bold text-violet-400 tracking-wider mb-2">About Me</p>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {profile.bio || "No bio added yet. Tell the world about yourself!"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}