"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, LogOut, Settings, History, Bookmark, Key } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const { user, profile, loading, role } = useAuth();
    const router = useRouter();

    if (loading) return <div className="h-screen flex items-center justify-center text-raz-muted uppercase tracking-widest animate-pulse">Initializing Profile...</div>;
    if (!user) {
        if (typeof window !== "undefined") router.push("/auth/login");
        return null;
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const sections = [
        { icon: <Bookmark size={20} />, label: "Watchlist", count: "12 Items" },
        { icon: <History size={20} />, label: "History", count: "245 Total" },
        { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
    ];

    return (
        <div className="p-4 lg:p-10 max-w-6xl mx-auto pb-40">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Card: Info */}
                <div className="w-full lg:w-96 flex flex-col gap-6">
                    <div className="raz-glass p-8 flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <div className="h-32 w-32 rounded-3xl bg-gradient-raz p-1 shadow-2xl">
                                <div className="h-full w-full rounded-[20px] bg-raz-bg overflow-hidden border border-white/10 flex items-center justify-center">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} className="h-full w-full object-cover" />
                                    ) : (
                                        <User size={64} className="text-raz-primary" />
                                    )}
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-raz-bg border border-white/10 flex items-center justify-center shadow-xl">
                                <Shield size={20} className={cn(role === 'user' ? 'text-raz-muted' : 'text-raz-primary')} />
                            </div>
                        </div>

                        <h2 className="text-2xl font-black tracking-tighter uppercase">{profile?.username || user.email.split('@')[0]}</h2>
                        <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-raz-primary mt-2 uppercase">
                            {role} Account
                        </div>

                        <div className="w-full mt-8 space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-transparent hover:border-white/10 transition-all text-left">
                                <Mail size={18} className="text-raz-muted" />
                                <div className="overflow-hidden">
                                    <p className="text-[10px] text-raz-muted leading-none mb-1">Email Address</p>
                                    <p className="text-xs font-bold truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full mt-10 py-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <LogOut size={16} /> SIGN OUT
                        </button>
                    </div>
                </div>

                {/* Right Content: Stats & Actions */}
                <div className="flex-1 flex flex-col gap-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {sections.map((s, i) => (
                            <div key={i} className="raz-glass p-6 group cursor-pointer hover:bg-white/10 transition-all">
                                <div className="p-3 rounded-xl bg-white/5 text-raz-primary mb-4 w-fit group-hover:scale-110 transition-transform">
                                    {s.icon}
                                </div>
                                <h4 className="font-bold text-sm">{s.label}</h4>
                                <p className="text-xs text-raz-muted mt-1">{s.count || "Manage account"}</p>
                            </div>
                        ))}
                    </div>

                    <div className="raz-glass p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Key size={20} className="text-raz-primary" /> Security Overview
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div>
                                    <h5 className="text-sm font-bold">Two-Factor Authentication</h5>
                                    <p className="text-[10px] text-raz-muted mt-0.5">Protect your account with an extra layer of security.</p>
                                </div>
                                <button className="text-xs font-bold text-raz-primary">ENABLE</button>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 opacity-50">
                                <div>
                                    <h5 className="text-sm font-bold">Connected Devices</h5>
                                    <p className="text-[10px] text-raz-muted mt-0.5">Chrome on Windows • Last active 2 mins ago</p>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-1 rounded bg-green-500/20 text-green-500">ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
