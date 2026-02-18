/**
 * ============================================================
 * Episodes API - GET/POST /api/contents/[id]/episodes
 * ============================================================
 * Terakhir diperbarui: 2026-02-18
 * Versi: 1.1.0
 * 
 * Mengelola episode untuk konten video (film, anime, donghua)
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/RAZDatabasePostgres';
import { requireAdmin } from '@/lib/RAZAuth';

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const res = await query(
            'SELECT * FROM episodes WHERE content_id = $1 ORDER BY season, episode_number',
            [id]
        );

        return NextResponse.json({ episodes: res.rows });
    } catch (error) {
        console.error('Get episodes error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const { user, error } = requireAdmin(request);
        if (error) return NextResponse.json({ error }, { status: 403 });

        const { id } = await params;
        const body = await request.json();

        // Support batch insert (array) atau single insert
        const episodes = Array.isArray(body) ? body : [body];
        const inserted = [];

        for (const ep of episodes) {
            const res = await query(`
                INSERT INTO episodes (content_id, season, episode_number, title, video_url, thumbnail, duration)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            `, [
                id, ep.season || 1, ep.episode_number, ep.title || '',
                ep.video_url, ep.thumbnail || '', ep.duration || ''
            ]);
            inserted.push({ id: res.rows[0].id, ...ep });
        }

        // Update timestamp konten secara asinkron
        query('UPDATE contents SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]).catch(err => console.error('Content update error:', err));

        return NextResponse.json({ episodes: inserted }, { status: 201 });
    } catch (error) {
        console.error('Create episode error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
