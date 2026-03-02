"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { LogIn, User, Lock, ArrowRight, Github } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/profile");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md raz-glass p-8 lg:p-10"
            >
                <div className="text-center mb-8">
                    <div className="h-16 w-16 bg-gradient-raz rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl shadow-raz-primary/20">
                        <LogIn size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter">WELCOME BACK</h1>
                    <p className="text-raz-muted text-sm mt-1">Sign in to your EntRAZ account.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-raz-muted" size={18} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-raz-primary outline-none transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-raz-muted" size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-raz-primary outline-none transition-all"
                        />
                    </div>

                    {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full raz-button-primary py-4 flex items-center justify-center gap-2 group"
                    >
                        {loading ? "AUTHENTICATING..." : "SIGN IN"} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                    <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-colors">
                        <Github size={18} /> Continue with GitHub
                    </button>

                    <p className="text-center text-xs text-raz-muted">
                        Don't have an account? <Link href="/auth/register" className="text-raz-primary hover:underline">Register here</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
