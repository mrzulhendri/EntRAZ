"use client";

import { motion } from "framer-motion";
import { Play, BookOpen, Music as MusicIcon, Star, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContentCard({ content, className }) {
    const { title, type, poster_url, rating, views_count, status } = content;

    const TypeIcon = () => {
        switch (type) {
            case 'video': return <Play size={16} fill="currentColor" />;
            case 'comic': return <BookOpen size={16} />;
            case 'music': return <MusicIcon size={16} />;
            default: return null;
        }
    };

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className={cn(
                "group relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-white/5 border border-white/10 transition-all duration-500 hover:border-raz-primary/50 tv-focus",
                className
            )}
        >
            {/* Poster Image */}
            <img
                src={poster_url || "https://images.unsplash.com/photo-1485846234645-a62644ef7467?q=80&w=2069&auto=format&fit=crop"}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                    <TypeIcon /> {type}
                </div>
                {status && (
                    <div className="rounded-lg bg-raz-primary px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                        {status}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="mb-2 line-clamp-2 text-sm font-bold text-white drop-shadow-lg">{title}</h3>

                <div className="flex items-center justify-between text-[10px] text-white/60">
                    <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-500" fill="currentColor" />
                        <span>{rating || "0.0"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye size={12} />
                        <span>{views_count || "0"}</span>
                    </div>
                </div>
            </div>

            {/* Hover Play/View Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="h-14 w-14 rounded-full bg-raz-primary flex items-center justify-center shadow-xl shadow-raz-primary/40 transform scale-50 group-hover:scale-100 transition-transform duration-500">
                    <Play size={24} className="text-white ml-1" fill="currentColor" />
                </div>
            </div>
        </motion.div>
    );
}
