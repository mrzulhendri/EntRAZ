/**
 * ============================================================
 * Chapters API - GET/POST /api/contents/[id]/chapters
 * ============================================================
 * Terakhir diperbarui: 2026-02-18
 * Versi: 1.1.0
 * 
 * Mengelola chapter untuk konten komik/manga/manwa
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/RAZDatabasePostgres';
import { requireAdmin } from '@/lib/RAZAuth';

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const res = await query(
            'SELECT * FROM chapters WHERE content_id = $1 ORDER BY chapter_number',
            [id]
        );

        // Parse JSON pages untuk setiap chapter jika disimpan sebagai STRING
        const chapters = res.rows.map(ch => ({
            ...ch,
            pages: typeof ch.pages === 'string' ? JSON.parse(ch.pages || '[]') : ch.pages,
        }));

        return NextResponse.json({ chapters });
    } catch (error) {
        console.error('Get chapters error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const { user, error } = requireAdmin(request);
        if (error) return NextResponse.json({ error }, { status: 403 });

        const { id } = await params;
        const body = await request.json();

        const chapters = Array.isArray(body) ? body : [body];
        const inserted = [];

        for (const ch of chapters) {
            const pages = JSON.stringify(ch.pages || []);
            const res = await query(`
                INSERT INTO chapters (content_id, chapter_number, title, pages)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `, [id, ch.chapter_number, ch.title || '', pages]);

            inserted.push({ id: res.rows[0].id, ...ch });
        }

        // Update timestamp konten secara asinkron
        query('UPDATE contents SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]).catch(err => console.error('Content update error:', err));

        return NextResponse.json({ chapters: inserted }, { status: 201 });
    } catch (error) {
        console.error('Create chapter error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
