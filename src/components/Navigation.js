"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Tv, PlayCircle, BookOpen, Music, Home,
    Search, User, Settings, Menu, X, Moon, Sun,
    Gamepad2, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Navigation - Unified component for PC, TV, and Mobile
 */
export default function Navigation() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [darkTheme, setDarkTheme] = useState(true);

    const navItems = [
        { name: "Home", path: "/", icon: <Home size={22} /> },
        { name: "Live TV", path: "/tv", icon: <Tv size={22} /> },
        { name: "VOD", path: "/vod", icon: <PlayCircle size={22} /> },
        { name: "Comics", path: "/comics", icon: <BookOpen size={22} /> },
        { name: "Music", path: "/music", icon: <Music size={22} /> },
        { name: "Shorts", path: "/shorts", icon: <Layers size={22} /> },
    ];

    // Handle Theme Toggle
    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
        document.documentElement.classList.toggle('dark');
        document.documentElement.setAttribute('data-theme', darkTheme ? 'light' : 'dark');
    };

    return (
        <>
            {/* Sidebar - Desktop & TV */}
            <aside className="fixed left-0 top-0 hidden h-full w-20 flex-col items-center border-r border-white/10 bg-black/40 backdrop-blur-raz py-8 lg:flex xl:w-64 transition-all duration-300 z-50">
                <div className="mb-12 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-raz">
                        <Zap size={24} className="text-white" />
                    </div>
                    <span className="hidden xl:block text-2xl font-black tracking-tighter">ENTRAZ</span>
                </div>

                <nav className="flex w-full flex-col gap-2 px-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "group flex items-center gap-4 rounded-xl p-3 transition-all duration-200 hover:bg-white/10 tv-focus",
                                pathname === item.path ? "bg-white/10 text-raz-primary font-bold" : "text-raz-muted"
                            )}
                        >
                            <span className={cn("transition-transform group-hover:scale-110", pathname === item.path && "text-raz-primary")}>
                                {item.icon}
                            </span>
                            <span className="hidden xl:block text-sm uppercase tracking-wider">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto flex w-full flex-col gap-2 px-4">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-4 rounded-xl p-3 text-raz-muted transition-all hover:bg-white/10 tv-focus"
                    >
                        {darkTheme ? <Sun size={22} /> : <Moon size={22} />}
                        <span className="hidden xl:block text-sm uppercase tracking-wider">Theme</span>
                    </button>
                    <Link
                        href="/profile"
                        className="flex items-center gap-4 rounded-xl p-3 text-raz-muted transition-all hover:bg-white/10 tv-focus"
                    >
                        <User size={22} />
                        <span className="hidden xl:block text-sm uppercase tracking-wider">Account</span>
                    </Link>
                </div>
            </aside>

            {/* Bottom Nav - Mobile */}
            <nav className="fixed bottom-0 left-0 flex w-full items-center justify-around border-t border-white/10 bg-black/60 backdrop-blur-raz p-2 lg:hidden z-50">
                {navItems.slice(0, 5).map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={cn(
                            "flex flex-col items-center p-2 rounded-lg",
                            pathname === item.path ? "text-raz-primary" : "text-raz-muted"
                        )}
                    >
                        {item.icon}
                        <span className="text-[10px] uppercase mt-1">{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* Mobile Top Header */}
            <header className="fixed top-0 left-0 flex w-full items-center justify-between p-4 lg:hidden z-40">
                <span className="text-xl font-black tracking-tighter bg-gradient-raz bg-clip-text text-transparent">ENTRAZ</span>
                <button onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu size={24} />
                </button>
            </header>
        </>
    );
}

function Zap({ size, className }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
    );
}
