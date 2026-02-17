'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../RAZGlobals.css';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('entraz_user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            router.push('/user/login');
        }
    }, []);

    function handleLogout() {
        localStorage.removeItem('entraz_token');
        localStorage.removeItem('entraz_user');
        router.push('/user/login');
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            <nav className="raz-navbar">
                <Link href="/" className="raz-nav-logo">EntRAZ</Link>
            </nav>

            <div className="pt-24 px-8 max-w-[800px] mx-auto">
                <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

                    <div className="px-8 pb-8 relative">
                        <div className="w-24 h-24 bg-slate-200 rounded-full absolute -top-12 border-4 border-[#1e293b] flex items-center justify-center text-slate-800 text-3xl font-bold">
                            {user.username?.[0]?.toUpperCase() || 'U'}
                        </div>

                        <div className="mt-16 flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold">{user.username}</h1>
                                <p className="text-slate-400">{user.email}</p>
                                <span className={`inline-block mt-2 px-3 py-1 rounded text-xs uppercase font-bold bg-slate-700 text-slate-300`}>
                                    {user.role} Account
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded hover:bg-red-500/20 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href="/user/history" className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors group">
                                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">🕒</div>
                                <h3 className="font-bold">Watch History</h3>
                                <p className="text-sm text-slate-400">Resume your movies and comics</p>
                            </Link>

                            <Link href="/user/settings" className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors group">
                                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">⚙️</div>
                                <h3 className="font-bold">Account Settings</h3>
                                <p className="text-sm text-slate-400">Change password and email</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
