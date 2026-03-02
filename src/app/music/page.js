"use client";

import { useState } from "react";
import ContentCard from "@/components/ContentCard";
import { Music, Play, Heart, Share2, MoreHorizontal, Disc } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MusicPage() {
    const playlists = [
        { title: "Midnight Echoes", desc: "For the late night workers", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop" },
        { title: "Synthwave Dreams", desc: "Retro future vibes", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop" },
        { title: "Indie Pulse", desc: "New underground sounds", cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop" },
    ];

    const tracks = [
        { title: "The Perfect Girl", artist: "Mareux", duration: "2:54" },
        { title: "After Dark", artist: "Mr.Kitty", duration: "4:17" },
        { title: "Resonance", artist: "HOME", duration: "3:32" },
        { title: "Nightcall", artist: "Kavinsky", duration: "4:18" },
        { title: "Blinding Lights", artist: "The Weeknd", duration: "3:20" },
    ];

    return (
        <div className="p-4 lg:p-10 pb-40">
            {/* Hero Banner */}
            <div className="relative h-64 lg:h-80 w-full overflow-hidden rounded-3xl mb-12 raz-glass flex items-center p-8 lg:p-16">
                <div className="relative z-10 max-w-xl">
                    <div className="flex items-center gap-4 text-raz-primary font-bold text-sm uppercase mb-4 tracking-tighter">
                        <Disc className="animate-spin-slow" size={24} /> Recommended for you
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black mb-6">SOUNDS OF THE FUTURE</h1>
                    <button className="raz-button-primary flex items-center gap-2 px-8">
                        <Play size={20} fill="currentColor" /> Play Daily Mix
                    </button>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none" />
                <Music className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 -rotate-12" />
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Playlists Column */}
                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-bold mb-6">Top Playlists</h2>
                    <div className="flex flex-col gap-4">
                        {playlists.map((pl, i) => (
                            <div key={i} className="raz-glass p-3 flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all active:scale-95">
                                <div className="h-16 w-16 rounded-xl overflow-hidden border border-white/10">
                                    <img src={pl.cover} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt={pl.title} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">{pl.title}</h4>
                                    <p className="text-[10px] text-raz-muted">{pl.desc}</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-raz-primary opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity shadow-lg">
                                    <Play size={14} fill="currentColor" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tracks Column */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-6">Popular Tracks</h2>
                    <div className="flex flex-col gap-2">
                        {tracks.map((track, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 group transition-colors cursor-pointer">
                                <span className="w-4 text-center text-xs text-raz-muted group-hover:hidden">{i + 1}</span>
                                <Play size={16} className="hidden group-hover:block text-raz-primary" fill="currentColor" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm tracking-tight">{track.title}</h4>
                                    <p className="text-[10px] text-raz-muted">{track.artist}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <button className="text-raz-muted hover:text-raz-secondary transition-colors">
                                        <Heart size={16} />
                                    </button>
                                    <span className="text-xs text-raz-muted w-10">{track.duration}</span>
                                    <button className="text-raz-muted hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
