"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Layout, ShieldAlert, Zap, Globe, Database, Activity, ArrowUpRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SuperAdminDashboard() {
    const stats = [
        { label: "Total Users", value: "24,502", change: "+12%", icon: <Users className="text-blue-500" /> },
        { label: "Contents", value: "8,920", change: "+5%", icon: <Layout className="text-raz-primary" /> },
        { label: "Active Scrapers", value: "12", change: "Stable", icon: <Zap className="text-yellow-500" /> },
        { label: "Storage Used", value: "450 GB", change: "75%", icon: <Database className="text-raz-secondary" /> },
    ];

    return (
        <div className="p-6 lg:p-10 bg-raz-bg min-h-screen text-raz-text">
            {/* Header */}
            <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                        <ShieldAlert className="text-raz-primary" size={32} /> SUPERADMIN CENTRAL
                    </h1>
                    <p className="text-raz-muted text-sm mt-1">System health and high-level management overview.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-green-500/10 text-green-500 text-xs font-bold flex items-center gap-2 border border-green-500/20">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                        ALL SYSTEMS OPERATIONAL
                    </div>
                    <button className="raz-button-primary bg-none bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold flex items-center gap-2">
                        System Logs <ArrowUpRight size={18} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="raz-glass p-6 group hover:translate-y-[-4px] transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-raz-primary/10 transition-colors">
                                {s.icon}
                            </div>
                            <span className={cn(
                                "text-xs font-black px-2 py-1 rounded-lg",
                                s.change.startsWith("+") ? "bg-green-500/10 text-green-500" : "bg-white/5 text-raz-muted"
                            )}>
                                {s.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-black">{s.value}</h3>
                        <p className="text-xs text-raz-muted uppercase tracking-widest mt-1 font-bold">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Scraper Activity */}
                <div className="lg:col-span-2 raz-glass p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2"><Activity size={20} /> Real-time Scraper Monitor</h2>
                        <button className="text-xs text-raz-primary font-bold hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold">AnimeFLV Scraper</h4>
                                        <p className="text-[10px] text-raz-muted">Target: https://animeflv.net • Running Daily</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-green-500">SUCCESS</div>
                                    <div className="text-[10px] text-raz-muted">5 mins ago • 12 new items</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Settings Quick Access */}
                <div className="raz-glass p-6 bg-gradient-to-br from-indigo-500/5 to-transparent">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Globe size={20} /> System Nodes</h2>
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-xs font-bold">
                                <span>API Gateway</span>
                                <span className="text-green-500">98ms</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[95%] bg-green-500" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-xs font-bold">
                                <span>Database (Supabase)</span>
                                <span className="text-green-500">42ms</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[98%] bg-green-500" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-xs font-bold">
                                <span>Video Transcoder</span>
                                <span className="text-yellow-500">Processing</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[65%] bg-yellow-500" />
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-10 py-3 rounded-2xl bg-white/10 border border-white/10 text-xs font-bold hover:bg-white/20 transition-all">
                        MANAGE INFRASTRUCTURE
                    </button>
                </div>
            </div>
        </div>
    );
}
