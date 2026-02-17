'use client';

import { useEffect, useState } from 'react';
import './RAZAdminDashboard.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                } else {
                    // Fallback/Error state
                    console.error('Failed to fetch stats');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) return <div className="raz-loading">Loading dashboard...</div>;

    const s = stats?.stats || { totalContent: 0, totalUsers: 0, totalEpisodes: 0, totalChapters: 0 };
    const recent = stats?.recentContent || [];

    return (
        <div className="raz-dashboard">
            <div className="raz-dashboard-grid">
                <div className="raz-stat-card">
                    <span className="raz-stat-icon">🎬</span>
                    <div className="raz-stat-title">Total Content</div>
                    <div className="raz-stat-value">{s.totalContent}</div>
                    <div className="raz-stat-change up">Movies, Anime, Comics</div>
                </div>

                <div className="raz-stat-card">
                    <span className="raz-stat-icon">👥</span>
                    <div className="raz-stat-title">Total Users</div>
                    <div className="raz-stat-value">{s.totalUsers}</div>
                    <div className="raz-stat-change up">Active Accounts</div>
                </div>

                <div className="raz-stat-card">
                    <span className="raz-stat-icon">📺</span>
                    <div className="raz-stat-title">Total Episodes</div>
                    <div className="raz-stat-value">{s.totalEpisodes}</div>
                    <div className="raz-stat-change">Video Content</div>
                </div>

                <div className="raz-stat-card">
                    <span className="raz-stat-icon">📖</span>
                    <div className="raz-stat-title">Total Chapters</div>
                    <div className="raz-stat-value">{s.totalChapters}</div>
                    <div className="raz-stat-change">Reading Content</div>
                </div>
            </div>

            <div className="raz-dashboard-sections">
                {/* Recent Activity */}
                <div className="raz-card">
                    <div className="raz-card-header">
                        <div className="raz-card-title">Recent Uploads</div>
                        <button className="raz-btn">View All</button>
                    </div>

                    <div className="raz-recent-list">
                        {recent.length > 0 ? (
                            recent.map(item => (
                                <div key={item.id} className="raz-recent-item">
                                    <div className="raz-item-info">
                                        <div className="raz-item-title">{item.title}</div>
                                        <div className="raz-item-meta">{new Date(item.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <span className={`raz-badge raz-badge-${item.type}`}>{item.type}</span>
                                </div>
                            ))
                        ) : (
                            <div className="raz-empty-state">No content yet.</div>
                        )}
                    </div>
                </div>

                {/* Scraper Status */}
                <div className="raz-card">
                    <div className="raz-card-header">
                        <div className="raz-card-title">System Status</div>
                    </div>

                    <div className="raz-status-list">
                        <div className="raz-status-row">
                            <div className="raz-status-label">
                                <div className="raz-status-dot dot-active"></div>
                                Scraper Engine
                            </div>
                            <div className="raz-status-value">Ready</div>
                        </div>

                        <div className="raz-status-row">
                            <div className="raz-status-label">
                                <div className="raz-status-dot dot-active"></div>
                                Database
                            </div>
                            <div className="raz-status-value">Connected</div>
                        </div>

                        <div className="raz-status-row">
                            <div className="raz-status-label">
                                <div className="raz-status-dot dot-active"></div>
                                File System
                            </div>
                            <div className="raz-status-value">Writable</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
