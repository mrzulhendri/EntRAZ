'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import '@/app/RAZGlobals.css';


export default function Browse() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f172a] text-center pt-20">Loading search...</div>}>
            <BrowseContent />
        </Suspense>
    );
}

function BrowseContent() {
    const searchParams = useSearchParams();
    const initialType = searchParams.get('type') || '';

    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: initialType,
        search: '',
        sort: 'newest'
    });

    useEffect(() => {
        fetchContents();
    }, [filters]);

    async function fetchContents() {
        setLoading(true);
        try {
            const query = new URLSearchParams(filters);
            const res = await fetch(`/api/contents?${query.toString()}&limit=24`);
            if (res.ok) {
                const data = await res.json();
                setContents(data.contents);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen pb-12">
            <nav className="raz-navbar">
                <Link href="/" className="raz-nav-logo">EntRAZ</Link>
                <div className="raz-nav-links">
                    <Link href="/" className="raz-nav-link">Home</Link>
                    <Link href="/browse?type=movie" className={`raz-nav-link ${filters.type === 'movie' ? 'active' : ''}`} onClick={() => setFilters({ ...filters, type: 'movie' })}>Movies</Link>
                    <Link href="/browse?type=anime" className={`raz-nav-link ${filters.type === 'anime' ? 'active' : ''}`} onClick={() => setFilters({ ...filters, type: 'anime' })}>Anime</Link>
                    <Link href="/browse?type=comic" className={`raz-nav-link ${filters.type === 'comic' ? 'active' : ''}`} onClick={() => setFilters({ ...filters, type: 'comic' })}>Comics</Link>
                </div>
            </nav>

            <div className="pt-24 px-8 max-w-[1600px] mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Browse {filters.type ? filters.type : 'All Content'}</h1>

                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />

                        <select
                            className="bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            value={filters.sort}
                            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                        >
                            <option value="newest">Newest</option>
                            <option value="popular">Popular</option>
                            <option value="rating">Top Rated</option>
                            <option value="title">A-Z</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading contents...</div>
                ) : contents.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">No content found matching your criteria.</div>
                ) : (
                    <div className="raz-grid">
                        {contents.map(item => (
                            <Link href={`/detail/${item.id}`} key={item.id} className="raz-card">
                                <div className="raz-rating-badge">{item.rating || 'N/A'}</div>
                                <img
                                    src={item.cover_image || 'https://via.placeholder.com/200x300'}
                                    alt={item.title}
                                    className="raz-card-img"
                                />
                                <div className="raz-card-overlay">
                                    <div className="raz-card-title">{item.title}</div>
                                    <div className="raz-card-meta">
                                        {item.type} • {item.year || 'N/A'}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
