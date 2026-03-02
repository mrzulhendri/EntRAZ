'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '@/app/RAZReader.css';

function NovelContent({ params }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [content, setContent] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState(18);

    useEffect(() => {
        async function fetchData() {
            try {
                const resolvedParams = await params;
                const id = resolvedParams.id;
                const res = await fetch(`/api/contents/${id}`);
                if (!res.ok) throw new Error('Failed to load content');

                const data = await res.json();
                setContent(data.content);

                // Determine active chapter
                const chNum = parseFloat(searchParams.get('ch')) || 1;
                const activeCh = data.content.novel_chapters?.find(c => c.chapter_number === chNum);

                setChapter(activeCh);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [params, searchParams]);

    if (loading) return <div className="text-white text-center pt-20">Loading novel...</div>;
    if (!content) return <div className="text-white text-center pt-20">Content not found</div>;
    if (!chapter) return <div className="text-white text-center pt-20">Chapter not found</div>;

    return (
        <div className="raz-novel-container" style={{ fontSize: `${fontSize}px` }}>
            <div className="raz-reader-header dark-mode">
                <Link href={`/detail/${content.id}`} className="text-white hover:text-indigo-400">
                    ← Back
                </Link>
                <div className="raz-reader-title text-white">
                    {content.title} - Ch. {chapter.chapter_number}
                </div>
                <div className="raz-reader-controls text-white flex gap-2">
                    <button onClick={() => setFontSize(f => Math.max(12, f - 2))}>A-</button>
                    <button onClick={() => setFontSize(f => Math.min(32, f + 2))}>A+</button>
                </div>
            </div>

            <div className="raz-novel-content">
                <h1 className="raz-novel-chapter-title">{chapter.title || `Chapter ${chapter.chapter_number}`}</h1>
                <div className="raz-novel-text" dangerouslySetInnerHTML={{ __html: chapter.text_content || '<p>No content available.</p>' }} />
            </div>

            <div className="raz-reader-nav">
                {/* Navigation logic similar to comic reader */}
            </div>
        </div>
    );
}

export default function NovelReader({ params }) {
    return (
        <Suspense fallback={<div className="text-white text-center pt-20">Loading novel...</div>}>
            <NovelContent params={params} />
        </Suspense>
    );
}
