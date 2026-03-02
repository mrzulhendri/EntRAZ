"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Play, Search, AlertCircle, CheckCircle2, RefreshCw, Layers, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function ScraperManagement() {
    const [scrapers, setScrapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [runningId, setRunningId] = useState(null);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchScrapers();
    }, []);

    async function fetchScrapers() {
        setLoading(true);
        const { data, error } = await supabase.from("scrapers").select("*");
        if (!error) setScrapers(data || []);
        setLoading(false);
    }

    const triggerScraper = async (scraperId) => {
        setRunningId(scraperId);
        try {
            const response = await fetch("/api/admin/scraper/trigger", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scraperId })
            });
            const data = await response.json();

            setLogs(prev => [{
                time: new Date().toLocaleTimeString(),
                msg: data.message || data.error,
                status: data.error ? "error" : "success"
            }, ...prev]);

            fetchScrapers();
        } catch (err) {
            console.error(err);
        } finally {
            setRunningId(null);
        }
    };

    const sampleScrapers = [
        { id: "1", name: "AnimeWorld Scraper", target_url: "https://animeworld.tv", is_active: true, last_run: "2026-03-02T10:00:00Z" },
        { id: "2", name: "CinemaSource Scraper", target_url: "https://cinema.io", is_active: false, last_run: null },
        { id: "3", name: "MangaReader Scraper", target_url: "https://mangareader.net", is_active: true, last_run: "2026-03-02T12:00:00Z" },
    ];

    const displayScrapers = scrapers.length > 0 ? scrapers : sampleScrapers;

    return (
        <div className="p-4 lg:p-10">
            <div className="mb-10">
                <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3 uppercase">
                    <Zap className="text-yellow-500" size={32} /> Scraper Engine
                </h1>
                <p className="text-raz-muted text-sm mt-1">Automated content synchronization and web scraping management.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Scraper List */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {displayScrapers.map((scraper) => (
                        <motion.div
                            key={scraper.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="raz-glass p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-3 rounded-2xl",
                                    scraper.is_active ? "bg-green-500/10 text-green-500" : "bg-white/5 text-raz-muted"
                                )}>
                                    <Layers size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{scraper.name}</h3>
                                    <p className="text-xs text-raz-muted truncate max-w-[200px]">{scraper.target_url}</p>
                                    <div className="mt-2 text-[10px] uppercase font-black tracking-widest text-raz-muted">
                                        Last Run: {scraper.last_run ? new Date(scraper.last_run).toLocaleString() : "NEVER"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-raz-muted transition-all">
                                    <RefreshCw size={20} />
                                </button>
                                <button
                                    onClick={() => triggerScraper(scraper.id)}
                                    disabled={runningId === scraper.id}
                                    className={cn(
                                        "raz-button-primary px-6 flex items-center gap-2",
                                        runningId === scraper.id && "grayscale opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {runningId === scraper.id ? "RUNNING..." : "TRIGGER NOW"}
                                    <Play size={16} fill="currentColor" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Console Logs */}
                <div className="flex flex-col gap-6">
                    <div className="raz-glass p-6 bg-black/40 h-[500px] flex flex-col">
                        <h3 className="font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
                            <ShieldAlert size={18} className="text-raz-primary" /> System Logs
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {logs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-raz-muted opacity-30">
                                    <RefreshCw size={40} className="mb-2" />
                                    <p className="text-xs uppercase font-bold tracking-widest">Awaiting triggers...</p>
                                </div>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className="text-[11px] font-mono p-2 rounded bg-white/5 border-l-2 border-raz-primary">
                                        <span className="text-raz-muted">[{log.time}]</span>{" "}
                                        <span className={log.status === "error" ? "text-red-400" : "text-green-400"}>
                                            {log.msg}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
