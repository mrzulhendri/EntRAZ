/**
 * ============================================================
 * Content Detail API - GET/PUT/DELETE /api/contents/[id]
 * ============================================================
 * Terakhir diperbarui: 2026-02-17
 * Versi: 1.0.0
 * 
 * GET: Mengambil detail konten beserta episodes/chapters
 * PUT: Mengupdate data konten (admin only)
 * DELETE: Menghapus konten (admin only)
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/RAZDatabase';
import { requireAdmin } from '@/lib/RAZAuth';

/**
 * GET - Mengambil detail konten dengan episodes/chapters
 */
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const db = getDatabase();

        // Ambil data konten
        const content = db.prepare('SELECT * FROM contents WHERE id = ?').get(id);
        if (!content) {
            return NextResponse.json({ error: 'Konten tidak ditemukan' }, { status: 404 });
        }

        // Tambahkan view count
        db.prepare('UPDATE contents SET view_count = view_count + 1 WHERE id = ?').run(id);

        // Ambil genres
        const genres = db.prepare(`
      SELECT g.* FROM genres g
      INNER JOIN content_genres cg ON g.id = cg.genre_id
      WHERE cg.content_id = ?
    `).all(id);

        // Ambil episodes (untuk konten video)
        const episodes = db.prepare(
            'SELECT * FROM episodes WHERE content_id = ? ORDER BY season, episode_number'
        ).all(id);

        // Ambil chapters (untuk komik/manga/manwa)
        const chapters = db.prepare(
            'SELECT id, content_id, chapter_number, title, created_at FROM chapters WHERE content_id = ? ORDER BY chapter_number'
        ).all(id);

        // Ambil novel chapters (untuk novel)
        const novelChapters = db.prepare(
            'SELECT id, content_id, chapter_number, title, word_count, created_at FROM novel_chapters WHERE content_id = ? ORDER BY chapter_number'
        ).all(id);

        // Ambil scraper sources
        const scraperSources = db.prepare(
            'SELECT * FROM scraper_sources WHERE content_id = ?'
        ).all(id);

        return NextResponse.json({
            content: {
                ...content,
                genres,
                episodes,
                chapters,
                novel_chapters: novelChapters,
                scraper_sources: scraperSources,
            },
        });
    } catch (error) {
        console.error('Get content detail error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}

/**
 * PUT - Mengupdate data konten (admin only)
 */
export async function PUT(request, { params }) {
    try {
        const { user, error } = requireAdmin(request);
        if (error) return NextResponse.json({ error }, { status: 403 });

        const { id } = await params;
        const body = await request.json();
        const db = getDatabase();

        // Cek konten ada
        const existing = db.prepare('SELECT id FROM contents WHERE id = ?').get(id);
        if (!existing) {
            return NextResponse.json({ error: 'Konten tidak ditemukan' }, { status: 404 });
        }

        // Update fields yang diberikan
        const fields = [];
        const values = [];
        const allowedFields = [
            'title', 'alternative_title', 'type', 'description', 'cover_image',
            'banner_image', 'status', 'rating', 'year', 'author', 'studio',
            'country', 'source_type', 'is_featured'
        ];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(field === 'is_featured' ? (body[field] ? 1 : 0) : body[field]);
            }
        }

        if (fields.length > 0) {
            fields.push('updated_at = CURRENT_TIMESTAMP');
            values.push(id);
            db.prepare(`UPDATE contents SET ${fields.join(', ')} WHERE id = ?`).run(...values);
        }

        // Update genres jika diberikan
        if (body.genres && Array.isArray(body.genres)) {
            db.prepare('DELETE FROM content_genres WHERE content_id = ?').run(id);
            const insertGenre = db.prepare(
                'INSERT OR IGNORE INTO content_genres (content_id, genre_id) VALUES (?, ?)'
            );
            for (const genreId of body.genres) {
                insertGenre.run(id, genreId);
            }
        }

        const updated = db.prepare('SELECT * FROM contents WHERE id = ?').get(id);
        return NextResponse.json({ content: updated });
    } catch (error) {
        console.error('Update content error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}

/**
 * DELETE - Menghapus konten (admin only, cascade ke episodes/chapters)
 */
export async function DELETE(request, { params }) {
    try {
        const { user, error } = requireAdmin(request);
        if (error) return NextResponse.json({ error }, { status: 403 });

        const { id } = await params;
        const db = getDatabase();

        const existing = db.prepare('SELECT id, title FROM contents WHERE id = ?').get(id);
        if (!existing) {
            return NextResponse.json({ error: 'Konten tidak ditemukan' }, { status: 404 });
        }

        // Delete cascade (foreign keys akan menghapus data terkait)
        db.prepare('DELETE FROM contents WHERE id = ?').run(id);

        return NextResponse.json({ message: `Konten "${existing.title}" berhasil dihapus` });
    } catch (error) {
        console.error('Delete content error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
