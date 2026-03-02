"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { UserPlus, User, Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // 1. Sign up user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        // 2. Create profile
        if (authData.user) {
            const { error: profileError } = await supabase
                .from("profiles")
                .insert({
                    id: authData.user.id,
                    username,
                    role: "user"
                });

            if (profileError) {
                setError(profileError.message);
                setLoading(false);
            } else {
                router.push("/profile");
            }
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
                        <UserPlus size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter">CREATE ACCOUNT</h1>
                    <p className="text-raz-muted text-sm mt-1">Join the EntRAZ premium experience.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-raz-muted" size={18} />
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
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-raz-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        {loading ? "CREATING ACCOUNT..." : "REGISTER"} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-xs text-raz-muted">
                        Already have an account? <Link href="/auth/login" className="text-raz-primary hover:underline">Login here</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
