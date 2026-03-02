"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Music, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShortsPage() {
    const shorts = [
        { id: 1, video: "https://v1.assets.tumblr.com/video_file/t:8nSjL-PzQ3I-R-2-pWpWZw/1706644265/tumblr_nzn3q1fQYQ1um0zsq_r1_720.mp4", user: "@raz_studio", desc: "Premium UI Design for EntRAZ 🚀 #webdesign #nextjs", music: "Original Sound - Raz Studio" },
        { id: 2, video: "https://v1.assets.tumblr.com/video_file/t:8nSjL-PzQ3I-R-2-pWpWZw/1706644265/tumblr_nzn3q1fQYQ1um0zsq_r1_720.mp4", user: "@anime_world", desc: "Best anime moments of 2026! 🔥 #anime #otaku", music: "Unravel - TK from Ling Tosite Sigure" },
    ];

    return (
        <div className="h-[calc(100vh-80px)] lg:h-screen w-full flex flex-col items-center overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
            {shorts.map((short) => (
                <div key={short.id} className="relative w-full h-full min-h-screen snap-start flex items-center justify-center">
                    {/* Video Mockup (Using a real video tag for effect) */}
                    <video
                        src={short.video}
                        className="h-full w-full object-cover lg:max-w-md lg:rounded-3xl shadow-2xl"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />

                    {/* Side Actions */}
                    <div className="absolute right-4 bottom-32 flex flex-col gap-6 text-white text-center">
                        <div className="flex flex-col items-center gap-1 group cursor-pointer">
                            <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Heart size={28} className="group-hover:text-red-500 transition-colors" />
                            </div>
                            <span className="text-xs font-bold">12.4K</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 group cursor-pointer">
                            <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
                                <MessageCircle size={28} />
                            </div>
                            <span className="text-xs font-bold">850</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 group cursor-pointer">
                            <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Share2 size={24} />
                            </div>
                            <span className="text-xs font-bold">Share</span>
                        </div>
                        <div className="h-12 w-12 rounded-full border-2 border-white overflow-hidden animate-spin-slow mt-4">
                            <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop" className="h-full w-full object-cover" />
                        </div>
                    </div>

                    {/* Info Bottom */}
                    <div className="absolute left-0 bottom-10 w-full p-6 lg:max-w-md lg:left-1/2 lg:-translate-x-1/2 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full border border-white/20 overflow-hidden">
                                <User size={40} className="text-white bg-raz-primary p-2" />
                            </div>
                            <h4 className="font-bold text-white tracking-tight">{short.user}</h4>
                            <button className="px-4 py-1 rounded-lg bg-raz-primary text-xs font-bold">Follow</button>
                        </div>
                        <p className="text-sm text-white/90 mb-4 line-clamp-2 leading-relaxed">{short.desc}</p>
                        <div className="flex items-center gap-2 text-white/70 overflow-hidden">
                            <Music size={14} className="flex-shrink-0" />
                            <div className="text-xs whitespace-nowrap animate-marquee">
                                {short.music} • {short.music} • {short.music}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
