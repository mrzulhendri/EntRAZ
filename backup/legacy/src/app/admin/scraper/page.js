'use client';

import { useState } from 'react';
import './../RAZAdminScraper.css';

export default function ScraperPage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [importing, setImporting] = useState(false);

    async function handlePreview(e) {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setPreview(null);
        try {
            const res = await fetch('/api/scraper/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const data = await res.json();
            if (res.ok) {
                setPreview(data.preview);
            } else {
                alert(data.error || 'Failed to scrape URL');
            }
        } catch (err) {
            alert('Error connecting to server');
        } finally {
            setLoading(false);
        }
    }

    async function handleImport() {
        if (!preview) return;
        setImporting(true);
        try {
            const payload = {
                url,
                type: preview.suggested_type,
                title: preview.title,
                description: preview.description,
                cover_image: preview.cover_image,
                genres: [], // TODO: Map genre names to IDs if needed
                status: preview.status,
                rating: preview.rating,
                import_episodes: preview.episodes,
                import_chapters: preview.chapters
            };

            const res = await fetch('/api/scraper/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Content imported successfully!');
                setPreview(null);
                setUrl('');
            } else {
                alert('Failed to import content');
            }
        } catch (err) {
            alert('Error importing content');
        } finally {
            setImporting(false);
        }
    }

    return (
        <div className="raz-scraper-page">
            <h1 className="raz-page-title" style={{ marginBottom: '2rem' }}>Web Scraper</h1>

            <div className="raz-scraper-container">
                <div className="raz-scraper-card">
                    <h2>Import from URL</h2>
                    <p className="text-muted">Enter a URL from a supported site to auto-fetch metadata, episodes, and chapters.</p>

                    <form onSubmit={handlePreview} className="raz-url-input-wrapper">
                        <input
                            type="url"
                            className="raz-url-input"
                            placeholder="https://example.com/anime/one-piece"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="raz-btn raz-btn-primary"
                            style={{ fontSize: '1.1rem', padding: '0 2rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Scraping...' : 'Preview'}
                        </button>
                    </form>
                </div>

                {preview && (
                    <div className="raz-scraper-card text-left">
                        <div className="raz-preview-grid">
                            <div>
                                <img src={preview.cover_image} alt="Cover" className="raz-preview-cover" />
                            </div>
                            <div>
                                <h3>{preview.title}</h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>{preview.description}</p>

                                <div className="raz-metadata-grid">
                                    <div className="raz-meta-item">
                                        <span className="raz-meta-label">Type</span>
                                        <strong>{preview.suggested_type}</strong>
                                    </div>
                                    <div className="raz-meta-item">
                                        <span className="raz-meta-label">Status</span>
                                        <strong>{preview.status}</strong>
                                    </div>
                                    <div className="raz-meta-item">
                                        <span className="raz-meta-label">Rating</span>
                                        <strong>{preview.rating}</strong>
                                    </div>
                                    <div className="raz-meta-item">
                                        <span className="raz-meta-label">Found</span>
                                        <strong>{preview.episodes_count} Eps / {preview.chapters_count} Ch</strong>
                                    </div>
                                </div>

                                <div className="raz-form-actions">
                                    <button
                                        className="raz-btn raz-btn-primary"
                                        onClick={handleImport}
                                        disabled={importing}
                                    >
                                        {importing ? 'Importing...' : 'Confirm Import'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {preview.episodes.length > 0 && (
                            <div className="raz-ep-list-preview">
                                <h4>Episodes Preview ({preview.episodes.length})</h4>
                                {preview.episodes.slice(0, 5).map(ep => (
                                    <div key={ep.episode_number} className="raz-ep-item">
                                        <span>Episode {ep.episode_number}</span>
                                        <span className="text-muted">{ep.title}</span>
                                    </div>
                                ))}
                                {preview.episodes.length > 5 && <div className="text-center p-2">...and {preview.episodes.length - 5} more</div>}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
