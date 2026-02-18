'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '@/app/RAZReader.css';

function ReadContent({ params }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [content, setContent] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const resolvedParams = await params;
                const id = resolvedParams.id;
                const res = await fetch(`/api/contents/${id}`);
                if (!res.ok) throw new Error('Failed to load content');

                const data = await res.json();
                setContent(data.content);
                setChapters(data.content.chapters || []);

                // Determine active chapter
                const chNum = parseFloat(searchParams.get('ch')) || 1;
                const activeCh = data.content.chapters?.find(c => c.chapter_number === chNum);

                if (activeCh) {
                    setChapter(activeCh);
                    // Parse pages if string, else use as is
                    let imgs = activeCh.pages;
                    if (typeof imgs === 'string') {
                        try { imgs = JSON.parse(imgs); } catch { imgs = []; }
                    }
                    setImages(imgs || []);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [params, searchParams]);

    if (loading) return <div className="text-white text-center pt-20">Loading reader...</div>;
    if (!content) return <div className="text-white text-center pt-20">Content not found</div>;
    if (!chapter) return <div className="text-white text-center pt-20">Chapter not found</div>;

    const currentIndex = chapters.findIndex(c => c.id === chapter.id);
    const prevCh = currentIndex > 0 ? chapters[currentIndex - 1] : null;
    const nextCh = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

    return (
        <div className="raz-reader-container">
            <header className="raz-reader-header">
                <Link href={`/detail/${content.id}`} className="text-white hover:text-indigo-400">
                    ← Back
                </Link>
                <div className="raz-reader-title text-white">
                    {content.title} - Ch. {chapter.chapter_number}
                </div>
                <div className="raz-reader-controls">
                    {/* Settings button placeholder */}
                </div>
            </header>

            <div className="raz-reader-content">
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Page ${index + 1}`}
                        className="raz-comic-page"
                        loading="lazy"
                    />
                ))}
                {images.length === 0 && (
                    <div className="text-center text-gray-500 py-20">
                        No images in this chapter.
                    </div>
                )}
            </div>

            <nav className="raz-reader-nav">
                <button
                    className="raz-btn-secondary px-4 py-2 rounded"
                    disabled={!prevCh}
                    onClick={() => router.push(`/read/${content.id}?ch=${prevCh.chapter_number}`)}
                >
                    Previous Chapter
                </button>

                <span className="text-white font-bold">
                    {currentIndex + 1} / {chapters.length}
                </span>

                <button
                    className="raz-btn-primary px-4 py-2 rounded"
                    disabled={!nextCh}
                    onClick={() => router.push(`/read/${content.id}?ch=${nextCh.chapter_number}`)}
                >
                    Next Chapter
                </button>
            </nav>
        </div>
    );
}

export default function ReadPage({ params }) {
    return (
        <Suspense fallback={<div className="text-white text-center pt-20">Loading reader...</div>}>
            <ReadContent params={params} />
        </Suspense>
    );
}
