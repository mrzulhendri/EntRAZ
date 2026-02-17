/**
 * ============================================================
 * Scraper Import API - POST /api/scraper/import
 * ============================================================
 * Terakhir diperbarui: 2026-02-17
 * Versi: 1.0.0
 * 
 * Endpoint untuk mengimport konten dari URL ke database.
 * Setelah admin preview dan konfirmasi, data disimpan.
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

        const body = await request.json();
        const {
            url, type, title, description, cover_image,
            genres, status, rating, year, author,
            import_episodes, import_chapters
        } = body;

        if (!url || !type || !title) {
            return NextResponse.json(
                { error: 'URL, tipe, dan judul wajib diisi' },
                { status: 400 }
            );
        }

        const db = getDatabase();

        // Simpan konten ke database
        const result = db.prepare(`
      INSERT INTO contents (
        title, type, description, cover_image, status, rating,
        year, author, source_type, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scraper', 0)
    `).run(
            title, type, description || '', cover_image || '',
            status || 'ongoing', rating || 0, year || null, author || ''
        );

        const contentId = result.lastInsertRowid;

        // Tambahkan genre
        if (genres && Array.isArray(genres) && genres.length > 0) {
            const insertGenre = db.prepare(
                'INSERT OR IGNORE INTO content_genres (content_id, genre_id) VALUES (?, ?)'
            );
            for (const genreId of genres) {
                insertGenre.run(contentId, genreId);
            }
        }

        // Simpan sumber scraper
        db.prepare(`
      INSERT INTO scraper_sources (content_id, source_url, scraper_type, status, last_checked)
      VALUES (?, ?, 'auto', 'active', CURRENT_TIMESTAMP)
    `).run(contentId, url);

        // Import episodes jika diminta
        if (import_episodes && Array.isArray(import_episodes)) {
            const insertEp = db.prepare(`
        INSERT INTO episodes (content_id, season, episode_number, title, video_url)
        VALUES (?, 1, ?, ?, ?)
      `);

            const insertEps = db.transaction((eps) => {
                for (const ep of eps) {
                    insertEp.run(contentId, ep.episode_number, ep.title || '', ep.video_url);
                }
            });
            insertEps(import_episodes);
        }

        // Import chapters jika diminta
        if (import_chapters && Array.isArray(import_chapters)) {
            const insertCh = db.prepare(`
        INSERT INTO chapters (content_id, chapter_number, title, pages)
        VALUES (?, ?, ?, '[]')
      `);

            const insertChs = db.transaction((chs) => {
                for (const ch of chs) {
                    insertCh.run(contentId, ch.chapter_number, ch.title || '');
                }
            });
            insertChs(import_chapters);
        }

        // Ambil konten yang baru dibuat
        const newContent = db.prepare('SELECT * FROM contents WHERE id = ?').get(contentId);

        return NextResponse.json({
            message: 'Konten berhasil diimport',
            content: newContent,
        }, { status: 201 });
    } catch (error) {
        console.error('Scraper import error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
