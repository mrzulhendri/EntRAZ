/**
 * ============================================================
 * Admin Stats API - GET /api/admin/stats
 * ============================================================
 * Terakhir diperbarui: 2026-02-18
 * Versi: 1.1.0
 * 
 * Dashboard statistics untuk admin panel.
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/RAZDatabasePostgres';
import { requireAdmin } from '@/lib/RAZAuth';

export async function GET(request) {
    try {
        const { user, error } = requireAdmin(request);
        if (error) return NextResponse.json({ error }, { status: 403 });

        // Total counts
        const contentRes = await query('SELECT COUNT(*) as count FROM contents');
        const userRes = await query('SELECT COUNT(*) as count FROM users');
        const episodeRes = await query('SELECT COUNT(*) as count FROM episodes');
        const chapterRes = await query('SELECT COUNT(*) as count FROM chapters');

        const totalContent = parseInt(contentRes.rows[0].count);
        const totalUsers = parseInt(userRes.rows[0].count);
        const totalEpisodes = parseInt(episodeRes.rows[0].count);
        const totalChapters = parseInt(chapterRes.rows[0].count);

        // Content by type
        const typeRes = await query(`
            SELECT type, COUNT(*) as count 
            FROM contents 
            GROUP BY type
        `);
        const contentTypeStats = typeRes.rows;

        // Recent activity (newest content)
        const recentRes = await query(`
            SELECT id, title, type, created_at 
            FROM contents 
            ORDER BY created_at DESC 
            LIMIT 5
        `);
        const recentContent = recentRes.rows;

        // Scraper status
        const scraperRes = await query(`
            SELECT status, COUNT(*) as count 
            FROM scraper_sources 
            GROUP BY status
        `);
        const scraperStats = scraperRes.rows;

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
