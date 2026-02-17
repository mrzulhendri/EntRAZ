/**
 * ============================================================
 * Admin Stats API - GET /api/admin/stats
 * ============================================================
 * Terakhir diperbarui: 2026-02-17
 * Versi: 1.0.0
 * 
 * Dashboard statistics untuk admin panel.
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/RAZDatabase';
import { requireAdmin } from '@/lib/RAZAuth';

export async function GET(request) {
    try {
        const { user, error } = requireAdmin(request);
        if (error) return NextResponse.json({ error }, { status: 403 });

        const db = getDatabase();

        // Total counts
        const totalContent = db.prepare('SELECT COUNT(*) as count FROM contents').get().count;
        const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
        const totalEpisodes = db.prepare('SELECT COUNT(*) as count FROM episodes').get().count;
        const totalChapters = db.prepare('SELECT COUNT(*) as count FROM chapters').get().count;

        // Content by type
        const contentTypeStats = db.prepare(`
      SELECT type, COUNT(*) as count 
      FROM contents 
      GROUP BY type
    `).all();

        // Recent activity (newest content)
        const recentContent = db.prepare(`
      SELECT id, title, type, created_at 
      FROM contents 
      ORDER BY created_at DESC 
      LIMIT 5
    `).all();

        // Scraper status
        const scraperStats = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM scraper_sources 
      GROUP BY status
    `).all();

        return NextResponse.json({
            stats: {
                totalContent,
                totalUsers,
                totalEpisodes,
                totalChapters,
            },
            contentTypeStats,
            recentContent,
            scraperStats,
        });
    } catch (error) {
        console.error('Get admin stats error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
