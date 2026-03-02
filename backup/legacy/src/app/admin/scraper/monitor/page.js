'use client';

import { useState } from 'react';
import './../../RAZAdminContent.css';

export default function LinkMonitor() {
    const [checking, setChecking] = useState(false);

    async function handleCheckAll() {
        setChecking(true);
        try {
            const res = await fetch('/api/scraper/check-links?all=true', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                alert(`Checked ${data.processed} links.`);
            } else {
                alert('Failed to check links');
            }
        } catch (err) {
            console.error(err);
            alert('Error connecting to server');
        } finally {
            setChecking(false);
        }
    }

    return (
        <div className="raz-content-page">
            <div className="raz-content-header">
                <h1 className="raz-page-title">Link Health Monitor</h1>
                <button
                    className="raz-btn raz-btn-primary"
                    onClick={handleCheckAll}
                    disabled={checking}
                >
                    {checking ? 'Checking...' : 'Check All Links'}
                </button>
            </div>

            <div className="raz-table-container">
                <table className="raz-table">
                    <thead>
                        <tr>
                            <th>Source URL</th>
                            <th>Content</th>
                            <th>Status</th>
                            <th>Last Checked</th>
                            <th>Response Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--raz-text-muted)' }}>
                                No active scraper sources found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
