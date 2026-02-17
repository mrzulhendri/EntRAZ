'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './RAZAdminLayout.css';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: '📊' },
        { name: 'Manage Content', path: '/admin/contents', icon: '🎬' },
        { name: 'Web Scraper', path: '/admin/scraper', icon: '🕸️' },
        { name: 'Link Monitor', path: '/admin/scraper/monitor', icon: '📡' },
        { name: 'Users', path: '/admin/users', icon: '👥' },
        { name: 'Reports', path: '/admin/reports', icon: '📈' },
        { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
    ];

    return (
        <div className="raz-admin-layout">
            {/* Sidebar */}
            <aside className={`raz-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="raz-sidebar-header">
                    <div className="raz-logo">EntRAZ Panel</div>
                </div>

                <nav className="raz-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`raz-nav-item ${pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="raz-nav-icon">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="raz-user-profile">
                    <div className="raz-avatar">A</div>
                    <div className="raz-user-info">
                        <div style={{ fontWeight: 600 }}>Administrator</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--raz-text-muted)' }}>Super Admin</div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="raz-main-content">
                <header className="raz-topbar">
                    <div className="raz-page-title">
                        {navItems.find(item => item.path === pathname)?.name || 'Admin Area'}
                    </div>

                    <div className="raz-actions">
                        <Link href="/" className="raz-btn">
                            🏠 View Site
                        </Link>
                        <button className="raz-btn">
                            🔔
                        </button>
                        <button className="raz-btn raz-btn-primary">
                            Logout
                        </button>
                    </div>
                </header>

                <div className="raz-content-body">
                    {children}
                </div>
            </main>
        </div>
    );
}
