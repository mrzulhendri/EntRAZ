'use client';

import { useState, useEffect } from 'react';
import './../RAZAdminContent.css';

export default function UsersPage() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // In real app, fetch from API. Mock implementation for UI dev.
        setUsers([
            { id: 1, username: 'admin', email: 'admin@entraz.local', role: 'admin', created_at: new Date().toISOString() },
            { id: 2, username: 'user1', email: 'user1@entraz.local', role: 'user', created_at: new Date().toISOString() }
        ]);
        setLoading(false);
    }, []);

    return (
        <div className="raz-content-page">
            <div className="raz-content-header">
                <h1 className="raz-page-title">User Management</h1>
            </div>

            <div className="raz-table-container">
                <table className="raz-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center p-4">Loading users...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="6" className="text-center p-4">No users found.</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td><strong>{user.username}</strong></td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`raz-badge ${user.role === 'admin' ? 'bg-indigo-500' : 'bg-gray-500'}`} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: user.role === 'admin' ? '#6366f1' : '#64748b' }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button className="raz-btn">Edit</button>
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
