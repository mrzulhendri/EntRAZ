"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import VideoPlayer from "@/components/Navigation"; // Wait, I need VideoPlayer
import { Search, Tv, Globe, Star, Wifi } from "lucide-react";
import DynamicVideoPlayer from "@/components/VideoPlayer";

export default function TVPage() {
    const [selectedChannel, setSelectedChannel] = useState({
        title: "Global News HD",
        src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop"
    });

    const channels = [
        { title: "Global News HD", group: "News", src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
        { title: "Sports Express", group: "Sports", src: "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8" },
        { title: "EntRAZ Cinema", group: "Movies", src: "https://d2zihajmtr5xj0.cloudfront.net/out/v1/4b1686650905479ea873d633f81e7d0e/index.m3u8" },
        { title: "Anime Central", group: "Anime", src: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8" },
    ];

    return (
        <div className="p-4 lg:p-10">
            <div className="flex flex-col xl:flex-row gap-8">
                {/* Player Section */}
                <div className="flex-1">
                    <DynamicVideoPlayer
                        src={selectedChannel.src}
                        title={selectedChannel.title}
                        poster={selectedChannel.poster}
                    />

                    <div className="mt-8 raz-glass p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-500/20 text-red-500">
                                    <Wifi size={20} className="animate-pulse" />
                                </div>
                                <h1 className="text-2xl font-bold">Now Playing</h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                    <Star size={18} /> Favorite
                                </button>
                            </div>
                        </div>
                        <p className="text-raz-muted leading-relaxed">
                            Streaming directly from EntRAZ Global Network. Experience lag-free entertainment with our high-speed HLS delivery system.
                        </p>
                    </div>
                </div>

                {/* Channel List Section */}
                <div className="w-full xl:w-96 flex flex-col gap-6">
                    <div className="raz-glass p-4">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-raz-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Search Channels..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:border-raz-primary outline-none transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {channels.map((ch, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedChannel(ch)}
                                    className={cn(
                                        "flex items-center gap-4 p-3 rounded-xl transition-all duration-300 text-left tv-focus",
                                        selectedChannel.title === ch.title ? "bg-raz-primary/20 border border-raz-primary/30" : "hover:bg-white/5 border border-transparent"
                                    )}
                                >
                                    <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center text-raz-primary">
                                        <Tv size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{ch.title}</h3>
                                        <span className="text-[10px] uppercase text-raz-muted tracking-widest">{ch.group}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="raz-glass p-6 bg-gradient-to-br from-indigo-500/10 to-transparent">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Globe size={18} /> Network Status
                        </h3>
                        <p className="text-xs text-raz-muted mb-4">Everything looks good! Servers are running at optimal speed.</p>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-raz-primary" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
