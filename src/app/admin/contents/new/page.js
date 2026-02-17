'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './../../RAZAdminContent.css';

export default function NewContent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'movie',
        status: 'ongoing',
        description: '',
        cover_image: '',
        rating: 0
    });

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/contents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/admin/contents');
            } else {
                alert('Failed to create content');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="raz-content-page">
            <div className="raz-content-header">
                <h1 className="raz-page-title">Add New Content</h1>
            </div>

            <div className="raz-form-container">
                <form onSubmit={handleSubmit}>
                    <div className="raz-form-group">
                        <label className="raz-label">Title</label>
                        <input
                            type="text"
                            className="raz-input-full"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="raz-form-group">
                        <label className="raz-label">Type</label>
                        <select
                            className="raz-input-full"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="movie">Movie</option>
                            <option value="anime">Anime</option>
                            <option value="donghua">Donghua</option>
                            <option value="comic">Comic</option>
                            <option value="manga">Manga</option>
                            <option value="manwa">Manwa</option>
                            <option value="novel">Novel</option>
                        </select>
                    </div>

                    <div className="raz-form-group">
                        <label className="raz-label">Description</label>
                        <textarea
                            className="raz-input-full raz-textarea"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="raz-form-group">
                        <label className="raz-label">Cover Image URL</label>
                        <input
                            type="url"
                            className="raz-input-full"
                            value={formData.cover_image}
                            onChange={e => setFormData({ ...formData, cover_image: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="raz-form-actions">
                        <button type="button" onClick={() => router.back()} className="raz-btn">
                            Cancel
                        </button>
                        <button type="submit" className="raz-btn raz-btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Content'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
