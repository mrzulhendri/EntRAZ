'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '@/app/RAZPlayer.css';


export default function WatchPage({ params }) {
    return (
        <Suspense fallback={<div className="text-white text-center pt-20">Loading player...</div>}>
            <WatchContent params={params} />
        </Suspense>
    );
}

function WatchContent({ params }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [content, setContent] = useState(null);
    const [episode, setEpisode] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const resolvedParams = await params;
                const id = resolvedParams.id;
                const res = await fetch(`/api/contents/${id}`);
                if (!res.ok) throw new Error('Failed to load content');

                const data = await res.json();
                setContent(data.content);
                setEpisodes(data.content.episodes || []);

                // Determine active episode
                const epNum = parseInt(searchParams.get('ep')) || 1;
                const activeEp = data.content.episodes?.find(e => e.episode_number === epNum) || data.content.episodes?.[0];
                setEpisode(activeEp);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [params, searchParams]);

    if (loading) return <div className="text-white text-center pt-20">Loading player...</div>;
    if (!content) return <div className="text-white text-center pt-20">Content not found</div>;
    if (!episode) return <div className="text-white text-center pt-20">Episode not found</div>;

    const currentIndex = episodes.findIndex(e => e.id === episode.id);
    const prevEp = currentIndex > 0 ? episodes[currentIndex - 1] : null;
    const nextEp = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

    return (
        <div className="raz-player-container">
            {/* Simple Header */}
            <div className="bg-black/80 px-4 py-2 flex justify-between items-center text-sm text-gray-400">
                <Link href={`/detail/${content.id}`} className="hover:text-white">← Back to Details</Link>
                <span>EntRAZ Player</span>
            </div>

            <div className="raz-player-wrapper">
                <iframe
                    src={episode.video_url}
                    className="raz-video-frame"
                    allowFullScreen
                    title={`Episode ${episode.episode_number}`}
                />

                <div className={`raz-episode-list-overlay ${sidebarOpen ? 'open' : ''}`}>
                    <div className="flex justify-between items-center mb-4 text-white">
                        <h3 className="font-bold">Episodes</h3>
                        <button onClick={() => setSidebarOpen(false)}>✕</button>
                    </div>
                    {episodes.map(ep => (
                        <button
                            key={ep.id}
                            onClick={() => {
                                router.push(`/watch/${content.id}?ep=${ep.episode_number}`);
                                setSidebarOpen(false);
                            }}
                            className={`raz-ep-btn ${ep.id === episode.id ? 'active' : ''}`}
                        >
                            Episode {ep.episode_number}
                        </button>
                    ))}
                </div>
            </div>

            <div className="raz-player-controls">
                <div className="raz-control-header">
                    <div>
                        <h1 className="raz-video-title">{content.title}</h1>
                        <div className="text-gray-400 text-sm">Episode {episode.episode_number}: {episode.title || `Episode ${episode.episode_number}`}</div>
                    </div>

                    <div className="raz-episode-nav">
                        <button
                            className="raz-nav-btn"
                            disabled={!prevEp}
                            onClick={() => router.push(`/watch/${content.id}?ep=${prevEp.episode_number}`)}
                        >
                            ⏮ Prev
                        </button>
                        <button
                            className="raz-nav-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            📑 List
                        </button>
                        <button
                            className="raz-nav-btn"
                            disabled={!nextEp}
                            onClick={() => router.push(`/watch/${content.id}?ep=${nextEp.episode_number}`)}
                        >
                            Next ⏭
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
