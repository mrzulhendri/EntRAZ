'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../RAZDetail.css';

export default function DetailPage({ params }) {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        async function fetchContent() {
            try {
                const { id } = await params;
                const res = await fetch(`/api/contents/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setContent(data.content);
                }

                // Check bookmark status if logged in
                const token = localStorage.getItem('entraz_token');
                if (token) {
                    const bmRes = await fetch('/api/user/bookmarks', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (bmRes.ok) {
                        const bmData = await bmRes.json();
                        const exists = bmData.bookmarks.some(b => b.content_id == id);
                        setIsBookmarked(exists);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, [params]);

    async function handleBookmarkToggle() {
        const token = localStorage.getItem('entraz_token');
        if (!token) {
            alert('Please login first');
            return;
        }

        try {
            if (isBookmarked) {
                // Remove
                await fetch(`/api/user/bookmarks?contentId=${content.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setIsBookmarked(false);
            } else {
                // Add
                await fetch('/api/user/bookmarks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ content_id: content.id })
                });
                setIsBookmarked(true);
            }
        } catch (err) {
            console.error(err);
        }
    }

    if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">Loading...</div>;
    if (!content) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">Content not found</div>;

    const isVideo = ['movie', 'anime', 'donghua'].includes(content.type);
    const isReading = ['comic', 'manga', 'manwa', 'novel'].includes(content.type);

    // Get first episode/chapter for "Start Watching/Reading" button
    const firstItem = isVideo
        ? (content.episodes?.[0] ? `/watch/${content.id}?ep=1` : '#')
        : (content.chapters?.[0] ? `/read/${content.id}?ch=1` : '#');

    const continueLabel = isVideo ? 'Start Watching' : 'Start Reading';
    const listLabel = isVideo ? 'Episodes' : 'Chapters';
    const items = isVideo ? content.episodes : content.chapters;

    return (
        <div className="min-h-screen bg-[#0f172a]">
            {/* Navbar Overlay */}
            <nav className="raz-navbar" style={{ background: 'transparent', border: 'none' }}>
                <Link href="/" className="raz-nav-logo">EntRAZ</Link>
                <div className="raz-nav-links">
                    <Link href="/" className="raz-nav-link">Back to Home</Link>
                </div>
            </nav>

            {/* Hero Header */}
            <div className="raz-detail-header">
                <img src={content.banner_image || content.cover_image} alt="" className="raz-detail-backdrop" />

                <div className="raz-detail-content">
                    <div className="raz-poster-wrapper">
                        <img src={content.cover_image} alt={content.title} className="raz-detail-poster" />
                    </div>

                    <div className="raz-detail-info">
                        <h1 className="raz-detail-title">{content.title}</h1>
                        {content.alternative_title && <div className="raz-detail-alt-title">{content.alternative_title}</div>}

                        <div className="raz-detail-meta-row">
                            <div className="raz-rating-star">⭐ {content.rating || 'N/A'}</div>
                            <span className="raz-meta-tag">{content.status}</span>
                            <span className="raz-meta-tag">{content.type.toUpperCase()}</span>
                            <span className="raz-meta-tag">{content.year || 'Unknown Year'}</span>
                            {content.genres?.map(g => (
                                <span key={g.id} className="text-slate-400">{g.name}</span>
                            ))}
                        </div>

                        <div className="raz-detail-actions">
                            <Link href={firstItem} className="raz-btn-action raz-btn-primary">
                                ▶ {continueLabel}
                            </Link>
                            <button
                                onClick={handleBookmarkToggle}
                                className={`raz-btn-action ${isBookmarked ? 'bg-pink-600 text-white hover:bg-pink-700' : 'raz-btn-secondary'}`}
                                style={isBookmarked ? { border: 'none' } : {}}
                            >
                                {isBookmarked ? '❤️ Remove from List' : '🤍 Add to List'}
                            </button>
                        </div>

                        <p className="raz-detail-desc">{content.description}</p>

                        <div className="raz-detail-specs">
                            <div className="raz-spec-item"><label>Author</label><span>{content.author || '-'}</span></div>
                            <div className="raz-spec-item"><label>Studio</label><span>{content.studio || '-'}</span></div>
                            <div className="raz-spec-item"><label>Country</label><span>{content.country || '-'}</span></div>
                            <div className="raz-spec-item"><label>Total Items</label><span>{items?.length || 0}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Episodes/Chapters List */}
            <div className="raz-episode-section">
                <div className="raz-list-header">
                    <h2 className="raz-list-title">{listLabel}</h2>
                    <div className="text-slate-400 font-mono text-sm">
                        {items?.length > 0 ? `${items.length} Available` : 'No items yet'}
                    </div>
                </div>

                <div className="raz-episode-grid">
                    {items?.map((item) => {
                        const num = isVideo ? item.episode_number : item.chapter_number;
                        const link = isVideo ? `/watch/${content.id}?ep=${num}` : `/read/${content.id}?ch=${num}`;
                        const title = item.title || `${listLabel.slice(0, -1)} ${num}`;

                        return (
                            <Link href={link} key={item.id} className="raz-episode-card">
                                <div className="raz-ep-number">{num}</div>
                                <div className="raz-ep-info">
                                    <span className="raz-ep-title">{title}</span>
                                    <span className="raz-ep-date">{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="text-indigo-400">▶</div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
