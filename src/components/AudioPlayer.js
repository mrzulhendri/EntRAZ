"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, List, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(30);
    const [currentTrack, setCurrentTrack] = useState({
        title: "Midnight City",
        artist: "M83",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop"
    });

    return (
        <div className="fixed bottom-0 left-0 lg:left-20 xl:left-64 right-0 z-[60] p-4 lg:p-6 bg-black/80 backdrop-blur-2xl border-t border-white/10">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                {/* Track Info */}
                <div className="flex items-center gap-4 w-1/3">
                    <div className="h-12 w-12 lg:h-14 lg:w-14 overflow-hidden rounded-xl border border-white/10 shadow-lg">
                        <img src={currentTrack.cover} className="h-full w-full object-cover" alt="Cover" />
                    </div>
                    <div className="hidden sm:block">
                        <h4 className="text-sm font-bold text-white line-clamp-1">{currentTrack.title}</h4>
                        <p className="text-xs text-raz-muted">{currentTrack.artist}</p>
                    </div>
                    <button className="text-raz-muted hover:text-raz-secondary transition-colors ml-2">
                        <Heart size={18} />
                    </button>
                </div>

                {/* Player Controls */}
                <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
                    <div className="flex items-center gap-6">
                        <button className="text-raz-muted hover:text-white transition-colors">
                            <SkipBack size={20} fill="currentColor" />
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                        >
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
                        </button>
                        <button className="text-raz-muted hover:text-white transition-colors">
                            <SkipForward size={20} fill="currentColor" />
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-3">
                        <span className="text-[10px] text-raz-muted min-w-[30px] text-right">1:24</span>
                        <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden cursor-pointer group">
                            <div
                                className="h-full bg-gradient-raz relative group-hover:bg-white transition-colors"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <span className="text-[10px] text-raz-muted min-w-[30px]">3:45</span>
                    </div>
                </div>

                {/* Extra Controls */}
                <div className="flex items-center justify-end gap-6 w-1/3">
                    <div className="hidden lg:flex items-center gap-3">
                        <Volume2 size={20} className="text-raz-muted" />
                        <div className="w-24 h-1 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full w-2/3 bg-white/40" />
                        </div>
                    </div>
                    <button className="text-raz-muted hover:text-white transition-colors">
                        <List size={20} />
                    </button>
                    <button className="text-raz-muted hover:text-white transition-colors">
                        <Maximize2 size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
}
