/**
 * ============================================================
 * Content Detail API - GET/PUT/DELETE /api/contents/[id]
 * ============================================================
 * Terakhir diperbarui: 2026-02-18
 * Versi: 1.1.0
 * 
 * GET: Mengambil detail konten beserta episodes/chapters
 * PUT: Mengupdate data konten (admin only)
 * DELETE: Menghapus konten (admin only)
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/RAZDatabasePostgres';
import { requireAdmin } from '@/lib/RAZAuth';

/**
 * GET - Mengambil detail konten dengan episodes/chapters
 */
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        // Ambil data konten
        const contentRes = await query('SELECT * FROM contents WHERE id = $1', [id]);
        const content = contentRes.rows[0];

        if (!content) {
            return NextResponse.json({ error: 'Konten tidak ditemukan' }, { status: 404 });
        }

        // Tambahkan view count (asynchronous & fire and forget as it's not critical for the response)
        query('UPDATE contents SET view_count = view_count + 1 WHERE id = $1', [id]).catch(err => console.error('View count update error:', err));

        // Ambil genres
        const genresRes = await query(`
            SELECT g.* FROM genres g
            INNER JOIN content_genres cg ON g.id = cg.genre_id
            WHERE cg.content_id = $1
        `, [id]);
        const genres = genresRes.rows;

        // Ambil episodes (untuk konten video)
        const episodesRes = await query(
            'SELECT * FROM episodes WHERE content_id = $1 ORDER BY season, episode_number',
            [id]
        );
        const episodes = episodesRes.rows;

        // Ambil chapters (untuk komik/manga/manwa)
        const chaptersRes = await query(
            'SELECT id, content_id, chapter_number, title, created_at FROM chapters WHERE content_id = $1 ORDER BY chapter_number',
            [id]
        );
        const chapters = chaptersRes.rows;

        // Ambil novel chapters (untuk novel)
        const novelChaptersRes = await query(
            'SELECT id, content_id, chapter_number, title, word_count, created_at FROM novel_chapters WHERE content_id = $1 ORDER BY chapter_number',
            [id]
        );
        const novelChapters = novelChaptersRes.rows;

        // Ambil scraper sources
        const scraperSourcesRes = await query(
            'SELECT * FROM scraper_sources WHERE content_id = $1',
            [id]
        );
        const scraperSources = scraperSourcesRes.rows;

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

        // Cek konten ada
        const existingRes = await query('SELECT id FROM contents WHERE id = $1', [id]);
        if (existingRes.rowCount === 0) {
            return NextResponse.json({ error: 'Konten tidak ditemukan' }, { status: 404 });
        }

        // Update fields yang diberikan
        const fields = [];
        const values = [];
        let pIndex = 1;
        const allowedFields = [
            'title', 'alternative_title', 'type', 'description', 'cover_image',
            'banner_image', 'status', 'rating', 'year', 'author', 'studio',
            'country', 'source_type', 'is_featured'
        ];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                fields.push(`${field} = $${pIndex++}`);
                values.push(field === 'is_featured' ? !!body[field] : body[field]);
            }
        }

        if (fields.length > 0) {
            fields.push(`updated_at = CURRENT_TIMESTAMP`);
            values.push(id);
            await query(`UPDATE contents SET ${fields.join(', ')} WHERE id = $${pIndex}`, values);
        }

        // Update genres jika diberikan
        if (body.genres && Array.isArray(body.genres)) {
            await query('DELETE FROM content_genres WHERE content_id = $1', [id]);
            for (const genreId of body.genres) {
                await query(
                    'INSERT INTO content_genres (content_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [id, genreId]
                );
            }
        }

        const updatedRes = await query('SELECT * FROM contents WHERE id = $1', [id]);
        return NextResponse.json({ content: updatedRes.rows[0] });
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

        const existingRes = await query('SELECT id, title FROM contents WHERE id = $1', [id]);
        if (existingRes.rowCount === 0) {
            return NextResponse.json({ error: 'Konten tidak ditemukan' }, { status: 404 });
        }

        // Delete cascade (foreign keys akan menghapus data terkait di Postgres)
        await query('DELETE FROM contents WHERE id = $1', [id]);

        return NextResponse.json({ message: `Konten "${existingRes.rows[0].title}" berhasil dihapus` });
    } catch (error) {
        console.error('Delete content error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
