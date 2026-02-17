/**
 * ============================================================
 * User History API - GET/POST /api/user/history
 * ============================================================
 * Terakhir diperbarui: 2026-02-17
 * Versi: 1.0.0
 * 
 * Mengelola riwayat tonton/baca pengguna.
 * GET: Mengambil riwayat
 * POST: Menyimpan/update progress
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/RAZDatabase';
import { authenticateRequest } from '@/lib/RAZAuth';

export async function GET(request) {
    try {
        const { user, error } = authenticateRequest(request);
        if (error) return NextResponse.json({ error }, { status: 401 });

        const db = getDatabase();
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'watch' or 'read'
        const limit = parseInt(searchParams.get('limit')) || 20;
        const page = parseInt(searchParams.get('page')) || 1;
        const offset = (page - 1) * limit;

        let query = `
      SELECT h.*, c.title, c.cover_image, c.type as content_type,
             e.episode_number, e.title as episode_title,
             ch.chapter_number, ch.title as chapter_title
      FROM user_history h
      JOIN contents c ON h.content_id = c.id
      LEFT JOIN episodes e ON h.episode_id = e.id
      LEFT JOIN chapters ch ON h.chapter_id = ch.id
      WHERE h.user_id = ?
    `;

        const params = [user.id];

        if (type) {
            query += ' AND h.history_type = ?';
            params.push(type);
        }

        query += ' ORDER BY h.last_accessed DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const history = db.prepare(query).all(...params);

        return NextResponse.json({ history });
    } catch (error) {
        console.error('Get history error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { user, error } = authenticateRequest(request);
        if (error) return NextResponse.json({ error }, { status: 401 });

        const body = await request.json();
        const { content_id, episode_id, chapter_id, progress, type } = body;

        if (!content_id || !type) {
            return NextResponse.json({ error: 'Content ID dan type wajib diisi' }, { status: 400 });
        }

        const db = getDatabase();

        // Cek apakah sudah ada history untuk konten ini
        const existing = db.prepare(
            'SELECT id FROM user_history WHERE user_id = ? AND content_id = ?'
        ).get(user.id, content_id);

        if (existing) {
            // Update history
            db.prepare(`
        UPDATE user_history 
        SET episode_id = ?, chapter_id = ?, progress = ?, history_type = ?, last_accessed = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
                episode_id || null,
                chapter_id || null,
                progress || 0,
                type,
                existing.id
            );
        } else {
            // Insert new history
            db.prepare(`
        INSERT INTO user_history (user_id, content_id, episode_id, chapter_id, progress, history_type)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
                user.id, content_id,
                episode_id || null,
                chapter_id || null,
                progress || 0,
                type
            );
        }

        // Tambahkan view count jika belum pernah dilihat hari ini (logic sederhana dulu: selalu tambah)
        // Di produksi bisa pakai tabel log terpisah untuk unik view

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Save history error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
