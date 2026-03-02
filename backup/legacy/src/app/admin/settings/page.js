'use client';

import { useState, useEffect } from 'react';
import '@/app/admin/RAZAdminLayout.css';

/**
 * RAZAdminSettings - Halaman Pengaturan Admin
 * Terakhir diperbarui: 2026-03-02
 * Versi: 1.0.0
 * 
 * Deskripsi:
 * Mengelola konfigurasi global aplikasi seperti nama situs, 
 * deskripsi SEO, dan pengaturan teknis lainnya.
 */
export default function AdminSettings() {
    const [settings, setSettings] = useState({
        siteName: 'EntRAZ',
        siteDescription: 'Platform Entertainment Terlengkap',
        maintenanceMode: false,
        allowRegistration: true,
        itemsPerPage: 20,
        apiCacheExpiry: 3600
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Simulasi simpan pengaturan (nantinya akan ke /api/admin/settings)
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan! ✨' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Gagal menyimpan pengaturan.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="raz-admin-settings">
            <div className="raz-card">
                <div className="raz-card-header">
                    <div className="raz-card-title">General Settings</div>
                </div>

                <form onSubmit={handleSave} className="raz-form">
                    <div className="raz-form-group">
                        <label className="raz-label">Site Name</label>
                        <input
                            type="text"
                            name="siteName"
                            className="raz-input"
                            value={settings.siteName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="raz-form-group">
                        <label className="raz-label">Site Description</label>
                        <textarea
                            name="siteDescription"
                            className="raz-input"
                            rows="3"
                            value={settings.siteDescription}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="raz-form-row">
                        <div className="raz-form-group">
                            <label className="raz-label">Items Per Page</label>
                            <input
                                type="number"
                                name="itemsPerPage"
                                className="raz-input"
                                value={settings.itemsPerPage}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="raz-form-group">
                            <label className="raz-label">API Cache (seconds)</label>
                            <input
                                type="number"
                                name="apiCacheExpiry"
                                className="raz-input"
                                value={settings.apiCacheExpiry}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="raz-checkbox-group">
                        <label className="raz-checkbox-label">
                            <input
                                type="checkbox"
                                name="maintenanceMode"
                                checked={settings.maintenanceMode}
                                onChange={handleChange}
                            />
                            Enable Maintenance Mode
                        </label>
                    </div>

                    <div className="raz-checkbox-group">
                        <label className="raz-checkbox-label">
                            <input
                                type="checkbox"
                                name="allowRegistration"
                                checked={settings.allowRegistration}
                                onChange={handleChange}
                            />
                            Allow New User Registration
                        </label>
                    </div>

                    <div className="raz-form-actions">
                        <button
                            type="submit"
                            className="raz-btn raz-btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    {message.text && (
                        <div className={`raz-alert raz-alert-${message.type}`}>
                            {message.text}
                        </div>
                    )}
                </form>
            </div>

            <style jsx>{`
                .raz-admin-settings {
                    max-width: 800px;
                }
                .raz-form {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .raz-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .raz-form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .raz-label {
                    font-weight: 500;
                    color: var(--raz-text);
                }
                .raz-input {
                    padding: 0.75rem;
                    border-radius: 8px;
                    border: 1px solid var(--raz-border);
                    background: var(--raz-bg-secondary);
                    color: var(--raz-text);
                    width: 100%;
                }
                .raz-checkbox-group {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .raz-checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    user-select: none;
                }
                .raz-btn-primary {
                    background: var(--raz-primary);
                    color: white;
                    padding: 0.75rem 2rem;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .raz-btn-primary:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                }
                .raz-btn-primary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .raz-alert {
                    padding: 1rem;
                    border-radius: 8px;
                    margin-top: 1rem;
                    font-weight: 500;
                }
                .raz-alert-success {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    border: 1px solid #10b981;
                }
                .raz-alert-error {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px solid #ef4444;
                }
            `}</style>
        </div>
    );
}
