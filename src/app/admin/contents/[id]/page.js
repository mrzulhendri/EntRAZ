'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './../../RAZAdminContent.css';

import RAZModal from '../../components/RAZModal';

export default function EditContent({ params }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState(null);
    const [activeTab, setActiveTab] = useState('details'); // details, episodes, chapters

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'info', onConfirm: null });

    const showModal = (title, message, type = 'info', onConfirm = null) => {
        setModalConfig({ title, message, type, onConfirm });
        setModalOpen(true);
    };

    const handeModalConfirm = async () => {
        if (modalConfig.onConfirm) {
            await modalConfig.onConfirm();
        }
        setModalOpen(false);
    };

    // Fetch content data on load
    useEffect(() => {
        async function fetchContent() {
            try {
                const { id } = await params;
                const res = await fetch(`/api/contents/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setContent(data.content);

                    // Set active tab based on content type
                    if (['movie', 'anime', 'donghua'].includes(data.content.type)) {
                        setActiveTab('episodes');
                    } else {
                        setActiveTab('chapters');
                    }
                } else {
                    router.push('/admin/contents');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, [params]);

    async function handleSaveDetails(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/contents/${content.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content)
            });

            if (res.ok) {
                showModal('Success', 'Content updated successfully', 'success');
            } else {
                showModal('Error', 'Failed to update content', 'error');
            }
        } catch (err) {
            showModal('Error', 'Error updating content', 'error');
        } finally {
            setSaving(false);
        }
    }

    function handleDeleteClick() {
        showModal('Delete Content?', 'Are you sure you want to delete this content? This action cannot be undone.', 'danger', async () => {
            try {
                const res = await fetch(`/api/contents/${content.id}`, { method: 'DELETE' });
                if (res.ok) {
                    router.push('/admin/contents');
                }
            } catch (err) {
                console.error(err);
            }
        });
    }

    if (loading) return <div className="p-4 text-center">Loading editor...</div>;
    if (!content) return <div className="p-4 text-center">Content not found</div>;

    return (
        <div className="raz-content-page">
            <RAZModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalConfig.title}
                footer={
                    <>
                        <button className="raz-btn-modal raz-btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                        {(modalConfig.type === 'danger' || modalConfig.onConfirm) && (
                            <button className={`raz-btn-modal ${modalConfig.type === 'danger' ? 'raz-btn-danger' : 'raz-btn-confirm'}`} onClick={handeModalConfirm}>
                                {modalConfig.type === 'danger' ? 'Delete' : 'Confirm'}
                            </button>
                        )}
                        {!modalConfig.onConfirm && modalConfig.type !== 'danger' && (
                            <button className="raz-btn-modal raz-btn-confirm" onClick={() => setModalOpen(false)}>OK</button>
                        )}
                    </>
                }
            >
                <p>{modalConfig.message}</p>
            </RAZModal>

            <div className="raz-content-header">
                <h1 className="raz-page-title">Edit: {content.title}</h1>
                <div className="raz-actions">
                    <button onClick={handleDeleteClick} className="raz-btn" style={{ borderColor: 'red', color: 'red' }}>
                        Delete Content
                    </button>
                </div>
            </div>

            <div className="raz-tabs">
                <button
                    className={`raz-tab ${activeTab === 'details' ? 'active' : ''}`}
                    onClick={() => setActiveTab('details')}
                >
                    Details
                </button>
                {['movie', 'anime', 'donghua'].includes(content.type) && (
                    <button
                        className={`raz-tab ${activeTab === 'episodes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('episodes')}
                    >
                        Episodes ({content.episodes?.length || 0})
                    </button>
                )}
                {['comic', 'manga', 'manwa', 'novel'].includes(content.type) && (
                    <button
                        className={`raz-tab ${activeTab === 'chapters' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chapters')}
                    >
                        Chapters ({content.chapters?.length || 0})
                    </button>
                )}
            </div>

            <div className="raz-tab-content">
                {activeTab === 'details' && (
                    <form onSubmit={handleSaveDetails} className="raz-form-container">
                        <div className="raz-form-group">
                            <label className="raz-label">Title</label>
                            <input
                                type="text"
                                className="raz-input-full"
                                value={content.title}
                                onChange={e => setContent({ ...content, title: e.target.value })}
                            />
                        </div>

                        <div className="raz-metadata-grid">
                            <div className="raz-form-group">
                                <label className="raz-label">Type</label>
                                <select
                                    className="raz-input-full"
                                    value={content.type}
                                    onChange={e => setContent({ ...content, type: e.target.value })}
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
                                <label className="raz-label">Status</label>
                                <select
                                    className="raz-input-full"
                                    value={content.status}
                                    onChange={e => setContent({ ...content, status: e.target.value })}
                                >
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                    <option value="hiatus">Hiatus</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="raz-form-group">
                            <label className="raz-label">Description</label>
                            <textarea
                                className="raz-input-full raz-textarea"
                                value={content.description}
                                onChange={e => setContent({ ...content, description: e.target.value })}
                            />
                        </div>

                        <div className="raz-form-group">
                            <label className="raz-label">Cover Image</label>
                            <div className="flex gap-4 items-start">
                                <img
                                    src={content.cover_image || 'https://via.placeholder.com/150'}
                                    alt="Preview"
                                    className="w-24 h-36 object-cover rounded"
                                />
                                <input
                                    type="url"
                                    className="raz-input-full"
                                    value={content.cover_image}
                                    onChange={e => setContent({ ...content, cover_image: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="raz-form-actions">
                            <button type="submit" className="raz-btn raz-btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'episodes' && (
                    <div className="raz-list-container">
                        <div className="flex justify-between mb-4">
                            <h3>Episodes List</h3>
                            <button className="raz-btn raz-btn-primary">+ Add Episode</button>
                        </div>
                        {/* List episodes implementation would go here */}
                        <div className="text-muted text-center py-8 bg-black/20 rounded">
                            Feature coming soon: Episode management UI
                        </div>
                    </div>
                )}

                {activeTab === 'chapters' && (
                    <div className="raz-list-container">
                        <div className="flex justify-between mb-4">
                            <h3>Chapters List</h3>
                            <button className="raz-btn raz-btn-primary">+ Add Chapter</button>
                        </div>
                        {/* List chapters implementation would go here */}
                        <div className="text-muted text-center py-8 bg-black/20 rounded">
                            Feature coming soon: Chapter management UI
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
