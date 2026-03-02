/**
 * ============================================================
 * Contents API - GET/POST /api/contents
 * ============================================================
 * Terakhir diperbarui: 2026-02-18
 * Versi: 1.1.0
 * 
 * GET: Mengambil daftar konten dengan filter dan pagination
 * POST: Menambahkan konten baru (admin only)
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/RAZDatabasePostgres';
import { requireAdmin } from '@/lib/RAZAuth';

/**
 * GET - Mengambil daftar konten
 * Query params: type, genre, status, search, page, limit, sort, featured
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        // Parameter filter
        const type = searchParams.get('type');           // Tipe konten (movie, anime, dll)
        const genre = searchParams.get('genre');          // Filter genre
        const status = searchParams.get('status');        // Status konten
        const search = searchParams.get('search');        // Kata kunci pencarian
        const featured = searchParams.get('featured');    // Hanya konten featured
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = Math.min(parseInt(searchParams.get('limit')) || 20, 100);
        const sort = searchParams.get('sort') || 'newest'; // newest, popular, rating, title
        const offset = (page - 1) * limit;

        // Bangun query dinamis
        let where = ['1=1'];
        let params = [];
        let pIndex = 1;

        if (type) {
            where.push(`c.type = $${pIndex++}`);
            params.push(type);
        }

        if (status) {
            where.push(`c.status = $${pIndex++}`);
            params.push(status);
        }

        if (search) {
            where.push(`(c.title ILIKE $${pIndex} OR c.alternative_title ILIKE $${pIndex} OR c.description ILIKE $${pIndex})`);
            const searchTerm = `%${search}%`;
            params.push(searchTerm);
            pIndex++;
        }

        if (featured === '1' || featured === 'true') {
            where.push('c.is_featured = TRUE');
        }

        // Filter genre (join dengan content_genres dan genres)
        let joinClause = '';
        if (genre) {
            joinClause = `
                INNER JOIN content_genres cg ON c.id = cg.content_id
                INNER JOIN genres g ON cg.genre_id = g.id
            `;
            where.push(`g.slug = $${pIndex++}`);
            params.push(genre);
        }

        const whereClause = where.join(' AND ');

        // Sorting
        let orderClause = 'c.created_at DESC';
        switch (sort) {
            case 'popular': orderClause = 'c.view_count DESC'; break;
            case 'rating': orderClause = 'c.rating DESC'; break;
            case 'title': orderClause = 'c.title ASC'; break;
            case 'oldest': orderClause = 'c.created_at ASC'; break;
            case 'updated': orderClause = 'c.updated_at DESC'; break;
        }

        // Hitung total data
        const countQuery = `SELECT COUNT(DISTINCT c.id) as total FROM contents c ${joinClause} WHERE ${whereClause}`;
        const countRes = await query(countQuery, params);
        const total = parseInt(countRes.rows[0].total);

        // Ambil data dengan pagination
        // Menggunakan STRING_AGG untuk Postgres (pengganti GROUP_CONCAT)
        const dataQuery = `
            SELECT DISTINCT c.*, 
                (SELECT STRING_AGG(g2.name, ', ') FROM content_genres cg2 
                 INNER JOIN genres g2 ON cg2.genre_id = g2.id 
                 WHERE cg2.content_id = c.id) as genre_names
            FROM contents c 
            ${joinClause}
            WHERE ${whereClause}
            ORDER BY ${orderClause}
            LIMIT $${pIndex++} OFFSET $${pIndex++}
        `;

        const contentsRes = await query(dataQuery, [...params, limit, offset]);
        const contents = contentsRes.rows;

        return NextResponse.json({
            contents,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get contents error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}

/**
 * POST - Menambahkan konten baru (admin only)
 */
export async function POST(request) {
    try {
        // Pastikan user adalah admin
        const { user, error } = requireAdmin(request);
        if (error) {
            return NextResponse.json({ error }, { status: 403 });
        }

        const body = await request.json();
        const {
            title, alternative_title, type, description, cover_image,
            banner_image, status, rating, year, author, studio, country,
            source_type, is_featured, genres
        } = body;

        // Validasi input wajib
        if (!title || !type) {
            return NextResponse.json(
                { error: 'Judul dan tipe konten wajib diisi' },
                { status: 400 }
            );
        }

        // Insert konten baru
        const insertQuery = `
            INSERT INTO contents (
                title, alternative_title, type, description, cover_image,
                banner_image, status, rating, year, author, studio, country,
                source_type, is_featured
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING id
        `;

        const insertRes = await query(insertQuery, [
            title, alternative_title || '', type, description || '',
            cover_image || '', banner_image || '', status || 'ongoing',
            rating || 0, year || null, author || '', studio || '',
            country || '', source_type || 'manual', is_featured || false
        ]);

        const contentId = insertRes.rows[0].id;

        // Tambahkan genre jika ada
        if (genres && Array.isArray(genres) && genres.length > 0) {
            for (const genreId of genres) {
                await query(
                    'INSERT INTO content_genres (content_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [contentId, genreId]
                );
            }
        }

        // Ambil data konten yang baru dibuat
        const newContentRes = await query('SELECT * FROM contents WHERE id = $1', [contentId]);
        const newContent = newContentRes.rows[0];

        return NextResponse.json({ content: newContent }, { status: 201 });
    } catch (error) {
        console.error('Create content error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
