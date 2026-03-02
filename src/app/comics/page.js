"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, List, Maximize2, ZoomIn, ZoomOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ComicReader() {
    const [currentPage, setCurrentPage] = useState(1);
    const [showOverlay, setShowOverlay] = useState(true);

    const pages = [
        "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2071&auto=format&fit=crop",
    ];

    return (
        <div className="relative min-h-screen bg-black">
            {/* Top Bar */}
            <AnimatePresence>
                {showOverlay && (
                    <motion.header
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        className="fixed top-0 left-0 lg:left-20 xl:left-64 right-0 z-50 p-4 bg-gradient-to-b from-black to-transparent flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                            <div>
                                <h1 className="font-bold text-lg">SOLO LEVELING: ORIGINS</h1>
                                <p className="text-xs text-raz-muted text-center">Chapter 145 • Page {currentPage} of {pages.length * 4}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Settings size={22} className="text-raz-muted hover:text-white cursor-pointer" />
                            <div className="h-10 px-4 rounded-xl bg-raz-primary flex items-center justify-center font-bold text-sm shadow-lg shadow-raz-primary/30">
                                Continue Next
                            </div>
                        </div>
                    </motion.header>
                )}
            </AnimatePresence>

            {/* Reader Content */}
            <div
                className="flex flex-col items-center pt-24 pb-32"
                onClick={() => setShowOverlay(!showOverlay)}
            >
                <div className="w-full max-w-3xl flex flex-col gap-4 px-2">
                    {pages.map((p, i) => (
                        <motion.img
                            key={i}
                            src={p}
                            className="w-full rounded-lg shadow-2xl border border-white/5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                    ))}
                    {/* Repeat for effect */}
                    {pages.map((p, i) => (
                        <motion.img
                            key={i + 3}
                            src={p}
                            className="w-full rounded-lg shadow-2xl border border-white/5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Controls */}
            <AnimatePresence>
                {showOverlay && (
                    <motion.footer
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 lg:left-20 xl:left-64 right-0 z-50 p-6 bg-gradient-to-t from-black to-transparent flex flex-col items-center gap-6"
                    >
                        <div className="flex items-center gap-8 p-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
                            <button className="text-raz-muted hover:text-white transition-colors">
                                <ZoomOut size={22} />
                            </button>
                            <div className="h-1.5 w-48 rounded-full bg-white/10 overflow-hidden">
                                <div className="h-full w-1/3 bg-raz-primary" />
                            </div>
                            <button className="text-raz-muted hover:text-white transition-colors">
                                <ZoomIn size={22} />
                            </button>
                            <div className="w-[1px] h-6 bg-white/10" />
                            <button className="text-raz-muted hover:text-white transition-colors">
                                <List size={22} />
                            </button>
                            <button className="text-raz-muted hover:text-white transition-colors">
                                <Maximize2 size={22} />
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <button className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 font-bold flex items-center gap-2 hover:bg-white/10">
                                <ChevronLeft size={20} /> Prev Chapter
                            </button>
                            <button className="px-8 py-3 rounded-xl bg-raz-primary font-bold flex items-center gap-2 shadow-lg shadow-raz-primary/20">
                                Next Chapter <ChevronRight size={20} />
                            </button>
                        </div>
                    </motion.footer>
                )}
            </AnimatePresence>
        </div>
    );
}

import { AnimatePresence } from "framer-motion";
