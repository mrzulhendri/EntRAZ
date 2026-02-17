/**
 * ============================================================
 * Chapters API - GET/POST /api/contents/[id]/chapters
 * ============================================================
 * Terakhir diperbarui: 2026-02-17
 * Versi: 1.0.0
 * 
 * Mengelola chapter untuk konten komik/manga/manwa
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/RAZDatabase';
import { requireAdmin } from '@/lib/RAZAuth';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const db = getDatabase();

        const chapters = db.prepare(
            'SELECT * FROM chapters WHERE content_id = ? ORDER BY chapter_number'
        ).all(id);

        // Parse JSON pages untuk setiap chapter
        const parsedChapters = chapters.map(ch => ({
            ...ch,
            pages: JSON.parse(ch.pages || '[]'),
        }));

        return NextResponse.json({ chapters: parsedChapters });
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

        const chapters = Array.isArray(body) ? body : [body];
        const inserted = [];

        const insertCh = db.prepare(`
      INSERT INTO chapters (content_id, chapter_number, title, pages)
      VALUES (?, ?, ?, ?)
    `);

        const insertAll = db.transaction((chs) => {
            for (const ch of chs) {
                const pages = JSON.stringify(ch.pages || []);
                const result = insertCh.run(id, ch.chapter_number, ch.title || '', pages);
                inserted.push({ id: result.lastInsertRowid, ...ch });
            }
        });

        insertAll(chapters);

        db.prepare('UPDATE contents SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);

        return NextResponse.json({ chapters: inserted }, { status: 201 });
    } catch (error) {
        console.error('Create chapter error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
