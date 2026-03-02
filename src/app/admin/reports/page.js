'use client';

import { useState, useEffect } from 'react';
import '@/app/admin/RAZAdminLayout.css';

/**
 * RAZAdminReports - Halaman Laporan Admin
 * Terakhir diperbarui: 2026-03-02
 * Versi: 1.0.0
 * 
 * Deskripsi:
 * Menampilkan statistik mendalam tentang penggunaan sistem, 
 * performa scraper, dan pertumbuhan konten.
 */
export default function AdminReports() {
    const [reportData, setReportData] = useState({
        contentGrowth: [
            { month: 'Jan', count: 45 },
            { month: 'Feb', count: 82 },
            { month: 'Mar', count: 124 }
        ],
        topContent: [
            { id: 1, title: 'Attack on Titan', views: 12500, type: 'anime' },
            { id: 2, title: 'One Piece', views: 11200, type: 'anime' },
            { id: 3, title: 'Solo Leveling', views: 9800, type: 'manwa' }
        ]
    });

    return (
        <div className="raz-admin-reports">
            <div className="raz-reports-grid">
                {/* Stats Overview */}
                <div className="raz-card">
                    <div className="raz-card-header">
                        <div className="raz-card-title">Content Distribution</div>
                    </div>
                    <div className="raz-report-content">
                        <div className="raz-progress-stack">
                            <div className="raz-progress-item">
                                <div className="raz-progress-info">
                                    <span>Anime</span>
                                    <span>45%</span>
                                </div>
                                <div className="raz-progress-bar">
                                    <div className="raz-progress-fill" style={{ width: '45%', background: '#ff4d4d' }}></div>
                                </div>
                            </div>
                            <div className="raz-progress-item">
                                <div className="raz-progress-info">
                                    <span>Comic</span>
                                    <span>30%</span>
                                </div>
                                <div className="raz-progress-bar">
                                    <div className="raz-progress-fill" style={{ width: '30%', background: '#33d9b2' }}></div>
                                </div>
                            </div>
                            <div className="raz-progress-item">
                                <div className="raz-progress-info">
                                    <span>Movie</span>
                                    <span>25%</span>
                                </div>
                                <div className="raz-progress-bar">
                                    <div className="raz-progress-fill" style={{ width: '25%', background: '#34ace0' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Performers */}
                <div className="raz-card">
                    <div className="raz-card-header">
                        <div className="raz-card-title">Most Viewed Content</div>
                    </div>
                    <div className="raz-report-content">
                        <table className="raz-report-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Views</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.topContent.map(content => (
                                    <tr key={content.id}>
                                        <td>{content.title}</td>
                                        <td><span className={`raz-badge raz-badge-${content.type}`}>{content.type}</span></td>
                                        <td>{content.views.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .raz-admin-reports {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .raz-reports-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .raz-report-content {
                    padding: 1.5rem;
                }
                .raz-progress-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .raz-progress-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    font-size: 0.9rem;
                }
                .raz-progress-bar {
                    height: 8px;
                    background: var(--raz-bg-secondary);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .raz-progress-fill {
                    height: 100%;
                    transition: width 1s ease-out;
                }
                .raz-report-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .raz-report-table th, .raz-report-table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid var(--raz-border);
                }
                .raz-report-table th {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    color: var(--raz-text-muted);
                    font-weight: 600;
                }
                .raz-badge {
                    padding: 0.25rem 0.6rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .raz-badge-anime { background: rgba(255, 77, 77, 0.1); color: #ff4d4d; }
                .raz-badge-comic { background: rgba(51, 217, 178, 0.1); color: #33d9b2; }
                .raz-badge-movie { background: rgba(52, 172, 224, 0.1); color: #34ace0; }
                
                @media (max-width: 992px) {
                    .raz-reports-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
