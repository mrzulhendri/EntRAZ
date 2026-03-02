"use client";

import { motion } from "framer-motion";
import { Tv, Play, BookOpen, Music, Users, Shield, Zap } from "lucide-react";

export default function HomePage() {
    const features = [
        { icon: <Tv size={32} />, title: "Live TV", desc: "M3U & Stream" },
        { icon: <Play size={32} />, title: "Cinema", desc: "Global Movies" },
        { icon: <BookOpen size={32} />, title: "Library", desc: "Comic & Manga" },
        { icon: <Music size={32} />, title: "Audio", desc: "Premium Sound" },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
            >
                <h1 className="mb-6 text-6xl font-black tracking-tighter md:text-8xl bg-gradient-raz bg-clip-text text-transparent">
                    ENTRAZ
                </h1>
                <p className="mb-10 text-xl font-medium md:text-2xl text-raz-muted max-w-2xl mx-auto">
                    One platform. All entertainment.
                    <span className="text-raz-text block mt-2 opacity-80">
                        No ads. No clutter. Just pure experience.
                    </span>
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button className="raz-button-primary text-lg px-10 py-4 flex items-center gap-2">
                        Get Started <Zap size={20} />
                    </button>
                    <button className="px-10 py-4 text-lg font-semibold border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                        Learn More
                    </button>
                </div>
            </motion.div>

            {/* Feature Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="grid grid-cols-2 gap-4 mt-24 md:grid-cols-4 max-w-6xl mx-auto"
            >
                {features.map((f, i) => (
                    <div
                        key={i}
                        className="raz-glass p-8 flex flex-col items-center group hover:bg-white/10 transition-all duration-500 cursor-pointer"
                    >
                        <div className="mb-4 text-raz-primary group-hover:scale-110 transition-transform duration-300">
                            {f.icon}
                        </div>
                        <h3 className="text-lg font-bold mb-1">{f.title}</h3>
                        <p className="text-sm text-raz-muted">{f.desc}</p>
                    </div>
                ))}
            </motion.div>

            {/* Quality Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-32 text-raz-muted opacity-50">
                <div className="flex items-center gap-2">
                    <Shield size={20} /> Ad-Free System
                </div>
                <div className="flex items-center gap-2">
                    <Users size={20} /> Multi-User Ready
                </div>
                <div className="flex items-center gap-2">
                    <Zap size={20} /> Next-Gen Speed
                </div>
            </div>
        </div>
    );
}
