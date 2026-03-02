"use client";

import { useState } from "react";
import ContentCard from "@/components/ContentCard";
import { Search, Filter, SlidersHorizontal, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CinemaPage() {
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Action", "Horror", "Comedy", "Anime", "Sci-Fi", "Drama"];

    const movies = [
        { title: "Interstellar: Beyond Time", type: "video", rating: 9.8, views_count: "1.2M", poster_url: "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=1974&auto=format&fit=crop", status: "New" },
        { title: "Cyber City 2077", type: "video", rating: 8.5, views_count: "850K", poster_url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop" },
        { title: "Ghost in the Machine", type: "video", rating: 9.1, views_count: "2.4M", poster_url: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1974&auto=format&fit=crop", status: "Premium" },
        { title: "Dragon Quest: Reborn", type: "video", rating: 8.9, views_count: "500K", poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop" },
        { title: "The Last Frontier", type: "video", rating: 7.6, views_count: "120K", poster_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop" },
        { title: "Ocean's Secret", type: "video", rating: 8.2, views_count: "980K", poster_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop" },
    ];

    return (
        <div className="p-4 lg:p-10">
            {/* Featured Hero Card */}
            <div className="relative mb-12 h-[50vh] min-h-[400px] w-full overflow-hidden rounded-3xl bg-black shadow-2xl">
                <img
                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop"
                    className="h-full w-full object-cover opacity-60"
                    alt="Hero"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 lg:p-16 max-w-2xl">
                    <div className="mb-4 flex items-center gap-2 rounded-full bg-raz-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white w-fit">
                        Featured Cinema
                    </div>
                    <h1 className="mb-4 text-4xl font-black lg:text-6xl tracking-tighter">PROJECT STARFALL</h1>
                    <p className="mb-8 text-raz-muted text-sm lg:text-base leading-relaxed">
                        The year is 2145. Humanity has reached the edges of the galaxy, only to find that we were never alone.
                        Experience the sci-fi event of the decade exclusively on EntRAZ.
                    </p>
                    <div className="flex items-center gap-4">
                        <button className="raz-button-primary flex items-center gap-2">
                            <Play size={20} fill="currentColor" /> Watch Now
                        </button>
                        <button className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-bold text-sm">
                            More Info
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Row */}
            <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-5 py-2 rounded-xl text-xs font-bold transition-all",
                                activeCategory === cat ? "bg-white text-black shadow-lg shadow-white/10" : "text-raz-muted hover:text-white"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-raz-muted" size={16} />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-raz-primary outline-none transition-all w-64"
                        />
                    </div>
                    <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-raz-muted transition-colors">
                        <SlidersHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mb-20">
                {movies.map((movie, i) => (
                    <ContentCard key={i} content={movie} />
                ))}
                {/* Placeholder cards to show grid */}
                {movies.map((movie, i) => (
                    <ContentCard key={i + 10} content={{ ...movie, status: "" }} />
                ))}
            </div>
        </div>
    );
}
