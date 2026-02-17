'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../../RAZGlobals.css';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const token = localStorage.getItem('entraz_token');
                if (!token) {
                    // Redirect or show empty
                    setLoading(false);
                    return;
                }

                const res = await fetch('/api/user/history?limit=50', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setHistory(data.history);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            <nav className="raz-navbar">
                <Link href="/" className="raz-nav-logo">EntRAZ</Link>
                <div className="raz-nav-links">
                    <Link href="/" className="raz-nav-link">Home</Link>
                    <Link href="/user/profile" className="raz-nav-link">Profile</Link>
                </div>
            </nav>

            <div className="pt-24 px-8 max-w-[1200px] mx-auto">
                <h1 className="text-3xl font-bold mb-8 border-l-4 border-indigo-500 pl-4">Watch & Read History</h1>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading history...</div>
                ) : history.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800 rounded-xl border border-slate-700">
                        <h3 className="text-xl mb-2">No history yet</h3>
                        <p className="text-slate-400 mb-6">Start watching movies or reading comics!</p>
                        <Link href="/" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-full font-bold transition-colors">
                            Browse Content
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map(item => (
                            <Link
                                href={`/${item.history_type === 'watch' ? 'watch' : 'read'}/${item.content_id}?${item.history_type === 'watch' ? 'ep' : 'ch'}=${item.episode_number || item.chapter_number || 1}`}
                                key={item.id}
                                className="flex items-center gap-4 bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700"
                            >
                                <img
                                    src={item.cover_image || 'https://via.placeholder.com/60x90'}
                                    alt={item.title}
                                    className="w-16 h-24 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                    <div className="text-slate-400 text-sm mb-2">
                                        {item.content_type.toUpperCase()} • Last {item.history_type === 'watch' ? 'watched' : 'read'}: {new Date(item.last_accessed).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-indigo-900 text-indigo-200 text-xs px-2 py-1 rounded">
                                            {item.history_type === 'watch'
                                                ? `Episode ${item.episode_number || '?'}`
                                                : `Chapter ${item.chapter_number || '?'}`
                                            }
                                        </span>
                                        {item.progress > 0 && (
                                            <div className="w-32 h-1 bg-slate-600 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500" style={{ width: `${Math.min(item.progress, 100)}%` }}></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-indigo-400 text-2xl">▶</div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
