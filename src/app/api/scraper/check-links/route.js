/**
 * ============================================================
 * Scraper Link Monitor API - POST /api/scraper/check-links
 * ============================================================
 * Terakhir diperbarui: 2026-02-17
 * Versi: 1.0.0
 * 
 * Endpoint untuk memeriksa status link scraper secara massal.
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/RAZDatabase';
import { requireAdmin } from '@/lib/RAZAuth';
import RAZScraper from '@/lib/RAZScraper';

export async function POST(request) {
    try {
        const { user, error } = requireAdmin(request);
        if (error) return NextResponse.json({ error }, { status: 403 });

        const db = getDatabase();

        // Ambil sumber yang aktif dan belum dicek dalam 24 jam terakhir
        // atau ambil semua jika parameter 'all' diberikan
        const { searchParams } = new URL(request.url);
        const checkAll = searchParams.get('all') === 'true';

        let query = 'SELECT * FROM scraper_sources WHERE status != "error"';
        if (!checkAll) {
            query += ' AND (last_checked IS NULL OR last_checked < datetime("now", "-1 day"))';
        }
        query += ' LIMIT 10'; // Batasi 10 link per request agar tidak timeout

        const sources = db.prepare(query).all();
        const results = [];

        const updateStatus = db.prepare(`
      UPDATE scraper_sources 
      SET status = ?, last_checked = CURRENT_TIMESTAMP, error_message = ?
      WHERE id = ?
    `);

        // Proses pengecekan link
        // TODO: Bisa dioptimalkan dengan Promise.all jika server kuat, tapi sequential lebih aman untuk menghindari blocking
        for (const source of sources) {
            const checkResult = await RAZScraper.checkLinkStatus(source.source_url);

            updateStatus.run(
                checkResult.status,
                checkResult.error || '',
                source.id
            );

            results.push({
                id: source.id,
                url: source.source_url,
                ...checkResult
            });
        }

        return NextResponse.json({
            processed: results.length,
            results
        });
    } catch (error) {
        console.error('Check links error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
