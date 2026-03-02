'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../../RAZGlobals.css';

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    async function fetchBookmarks() {
        try {
            const token = localStorage.getItem('entraz_token');
            if (!token) return;

            const res = await fetch('/api/user/bookmarks', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setBookmarks(data.bookmarks);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function removeBookmark(contentId) {
        if (!confirm('Remove from list?')) return;
        try {
            const token = localStorage.getItem('entraz_token');
            const res = await fetch(`/api/user/bookmarks?contentId=${contentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setBookmarks(bookmarks.filter(b => b.content_id !== contentId));
            }
        } catch (err) {
            console.error(err);
        }
    }

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
                <h1 className="text-3xl font-bold mb-8 border-l-4 border-pink-500 pl-4">My Collection</h1>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading bookmarks...</div>
                ) : bookmarks.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800 rounded-xl border border-slate-700">
                        <h3 className="text-xl mb-2">Your list is empty</h3>
                        <p className="text-slate-400 mb-6">Save your favorite movies and comics here!</p>
                        <Link href="/browse" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-full font-bold transition-colors">
                            Discover Content
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {bookmarks.map(item => (
                            <div key={item.id} className="bg-slate-800 rounded-lg overflow-hidden group relative">
                                <button
                                    onClick={(e) => { e.preventDefault(); removeBookmark(item.content_id); }}
                                    className="absolute top-2 right-2 z-10 bg-black/60 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                                    title="Remove"
                                >
                                    ✕
                                </button>
                                <Link href={`/detail/${item.content_id}`}>
                                    <div className="aspect-[2/3] relative">
                                        <img
                                            src={item.cover_image || 'https://via.placeholder.com/200x300'}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute top-2 left-2 bg-indigo-600 text-xs px-2 py-1 rounded font-bold shadow-lg">
                                            {item.content_type?.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-bold truncate">{item.title}</h3>
                                        <p className="text-xs text-slate-400">Added {new Date(item.created_at).toLocaleDateString()}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
