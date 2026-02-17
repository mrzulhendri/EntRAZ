/**
 * ============================================================
 * Episodes API - GET/POST /api/contents/[id]/episodes
 * ============================================================
 * Terakhir diperbarui: 2026-02-17
 * Versi: 1.0.0
 * 
 * Mengelola episode untuk konten video (film, anime, donghua)
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/RAZDatabase';
import { requireAdmin } from '@/lib/RAZAuth';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const db = getDatabase();

        const episodes = db.prepare(
            'SELECT * FROM episodes WHERE content_id = ? ORDER BY season, episode_number'
        ).all(id);

        return NextResponse.json({ episodes });
    } catch (error) {
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const { user, error } = requireAdmin(request);
        if (error) return NextResponse.json({ error }, { status: 403 });

        const { id } = await params;
        const body = await request.json();
        const db = getDatabase();

        // Support batch insert (array) atau single insert
        const episodes = Array.isArray(body) ? body : [body];
        const inserted = [];

        const insertEp = db.prepare(`
      INSERT INTO episodes (content_id, season, episode_number, title, video_url, thumbnail, duration)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

        const insertAll = db.transaction((eps) => {
            for (const ep of eps) {
                const result = insertEp.run(
                    id, ep.season || 1, ep.episode_number, ep.title || '',
                    ep.video_url, ep.thumbnail || '', ep.duration || ''
                );
                inserted.push({ id: result.lastInsertRowid, ...ep });
            }
        });

        insertAll(episodes);

        // Update timestamp konten
        db.prepare('UPDATE contents SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);

        return NextResponse.json({ episodes: inserted }, { status: 201 });
    } catch (error) {
        console.error('Create episode error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
