"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VideoPlayer({ src, poster, title }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [progress, setProgress] = useState(0);
    const controlsTimeout = useRef(null);

    useEffect(() => {
        let hls;
        if (src && videoRef.current) {
            if (Hls.isSupported() && src.endsWith(".m3u8")) {
                hls = new Hls();
                hls.loadSource(src);
                hls.attachMedia(videoRef.current);
            } else {
                videoRef.current.src = src;
            }
        }
        return () => {
            if (hls) hls.destroy();
        };
    }, [src]);

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(p);
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
        controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
    };

    return (
        <div
            className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl group"
            onMouseMove={handleMouseMove}
        >
            <video
                ref={videoRef}
                poster={poster}
                className="h-full w-full cursor-pointer"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
            />

            {/* Overlay Title */}
            <div className={cn(
                "absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500",
                showControls ? "opacity-100" : "opacity-0"
            )}>
                <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>

            {/* Controls */}
            <div className={cn(
                "absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500",
                showControls ? "opacity-100" : "opacity-0"
            )}>
                {/* Progress Bar */}
                <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                    <div
                        className="h-full bg-gradient-raz transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                        </button>
                        <div className="flex items-center gap-4 text-white/60">
                            <SkipBack size={20} className="hover:text-white cursor-pointer" />
                            <SkipForward size={20} className="hover:text-white cursor-pointer" />
                        </div>
                        <button onClick={() => setIsMuted(!isMuted)} className="text-white">
                            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </button>
                    </div>

                    <div className="flex items-center gap-6 text-white/80">
                        <Settings size={22} className="hover:rotate-45 transition-transform cursor-pointer" />
                        <Maximize size={22} className="hover:scale-110 transition-transform cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Centered Play Button (Visible when paused) */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none"
                    onClick={togglePlay}
                >
                    <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 animate-pulse">
                        <Play size={40} className="text-white ml-2" fill="currentColor" />
                    </div>
                </div>
            )}
        </div>
    );
}
