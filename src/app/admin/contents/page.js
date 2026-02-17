'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './../RAZAdminContent.css';

export default function ContentList() {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        page: 1
    });

    useEffect(() => {
        fetchContents();
    }, [filters]);

    async function fetchContents() {
        setLoading(true);
        try {
            const query = new URLSearchParams(filters);
            const res = await fetch(`/api/contents?${query.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setContents(data.contents);
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
                <h1 className="raz-page-title">Manage Content</h1>
                <Link href="/admin/contents/new" className="raz-btn raz-btn-primary">
                    + Add New
                </Link>
            </div>

            <div className="raz-filters">
                <input
                    type="text"
                    placeholder="Search items..."
                    className="raz-input"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                <select
                    className="raz-select"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                    <option value="">All Types</option>
                    <option value="movie">Movies</option>
                    <option value="anime">Anime</option>
                    <option value="comic">Comics</option>
                    <option value="novel">Novels</option>
                </select>
            </div>

            <div className="raz-table-container">
                <table className="raz-table">
                    <thead>
                        <tr>
                            <th width="50">#</th>
                            <th>Cover</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Episodes/Ch</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                        ) : contents.length === 0 ? (
                            <tr><td colSpan="7" className="text-center">No content found</td></tr>
                        ) : (
                            contents.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {item.cover_image && (
                                            <img src={item.cover_image} alt={item.title} className="raz-table-img" />
                                        )}
                                    </td>
                                    <td>
                                        <strong>{item.title}</strong>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--raz-text-muted)' }}>
                                            {item.genre_names}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`raz-badge raz-badge-${item.type}`}>{item.type}</span>
                                    </td>
                                    <td>
                                        <span className={`raz-status-badge status-${item.status}`}>{item.status}</span>
                                    </td>
                                    <td>-</td>
                                    <td>
                                        <Link href={`/admin/contents/${item.id}`} className="raz-btn" style={{ marginRight: '0.5rem' }}>
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
