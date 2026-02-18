/**
 * ============================================================
 * Setup Database API - GET /api/setup-db
 * ============================================================
 * Terakhir diperbarui: 2026-02-18
 * Versi: 1.0.0
 * 
 * Deskripsi:
 * Endpoint untuk inisialisasi tabel di Vercel Postgres.
 * Hanya bisa dijalankan di development atau dengan secret key tertentu.
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export async function GET(request) {
    try {
        // Inisialisasi Tabel Users
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'user' CHECK(role IN ('admin', 'user')),
        avatar TEXT DEFAULT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // Inisialisasi Tabel Contents
        await sql`
      CREATE TABLE IF NOT EXISTS contents (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        alternative_title TEXT DEFAULT '',
        type VARCHAR(50) NOT NULL CHECK(type IN ('movie', 'anime', 'donghua', 'comic', 'manga', 'manwa', 'novel', 'series')),
        description TEXT DEFAULT '',
        cover_image TEXT DEFAULT '',
        banner_image TEXT DEFAULT '',
        status VARCHAR(50) DEFAULT 'ongoing' CHECK(status IN ('ongoing', 'completed', 'hiatus', 'cancelled')),
        rating DECIMAL DEFAULT 0,
        year INTEGER DEFAULT NULL,
        author TEXT DEFAULT '',
        studio TEXT DEFAULT '',
        country TEXT DEFAULT '',
        source_type VARCHAR(50) DEFAULT 'manual' CHECK(source_type IN ('manual', 'scraper')),
        is_featured BOOLEAN DEFAULT FALSE,
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // Inisialisasi Tabel Episodes
        await sql`
      CREATE TABLE IF NOT EXISTS episodes (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
        season INTEGER DEFAULT 1,
        episode_number INTEGER NOT NULL,
        title TEXT DEFAULT '',
        video_url TEXT NOT NULL,
        thumbnail TEXT DEFAULT '',
        duration TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // Inisialisasi Tabel Chapters
        await sql`
      CREATE TABLE IF NOT EXISTS chapters (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
        chapter_number DECIMAL NOT NULL,
        title TEXT DEFAULT '',
        pages TEXT DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // Inisialisasi Tabel Novel Chapters
        await sql`
      CREATE TABLE IF NOT EXISTS novel_chapters (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
        chapter_number DECIMAL NOT NULL,
        title TEXT DEFAULT '',
        text_content TEXT DEFAULT '',
        word_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // Inisialisasi Tabel Scraper Sources
        await sql`
      CREATE TABLE IF NOT EXISTS scraper_sources (
        id SERIAL PRIMARY KEY,
        content_id INTEGER REFERENCES contents(id) ON DELETE SET NULL,
        source_url TEXT NOT NULL,
        scraper_type VARCHAR(50) DEFAULT 'auto',
        last_checked TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        status VARCHAR(50) DEFAULT 'active' CHECK(status IN ('active', 'offline', 'error', 'pending')),
        error_message TEXT DEFAULT '',
        metadata TEXT DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // Inisialisasi Tabel User History
        await sql`
      CREATE TABLE IF NOT EXISTS user_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content_id INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
        episode_id INTEGER DEFAULT NULL,
        chapter_id INTEGER DEFAULT NULL,
        progress DECIMAL DEFAULT 0,
        history_type VARCHAR(50) DEFAULT 'watch' CHECK(history_type IN ('watch', 'read')),
        last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // Inisialisasi Tabel Bookmarks
        await sql`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content_id INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, content_id)
      )
    `;

        // Inisialisasi Tabel Genres
        await sql`
      CREATE TABLE IF NOT EXISTS genres (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL
      )
    `;

        // Inisialisasi Tabel Content Genres
        await sql`
      CREATE TABLE IF NOT EXISTS content_genres (
        content_id INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
        genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
        PRIMARY KEY (content_id, genre_id)
      )
    `;

        // Seed Genre Default
        const defaultGenres = [
            ['Action', 'action'], ['Adventure', 'adventure'], ['Comedy', 'comedy'],
            ['Drama', 'drama'], ['Fantasy', 'fantasy'], ['Horror', 'horror'],
            ['Mystery', 'mystery'], ['Romance', 'romance'], ['Sci-Fi', 'sci-fi'],
            ['Thriller', 'thriller'], ['Slice of Life', 'slice-of-life'], ['Supernatural', 'supernatural']
        ];

        for (const [name, slug] of defaultGenres) {
            await sql`INSERT INTO genres (name, slug) VALUES (${name}, ${slug}) ON CONFLICT (name) DO NOTHING`;
        }

        // Seed Admin Default
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await sql`
      INSERT INTO users (username, email, password_hash, role) 
      VALUES ('admin', 'admin@entraz.local', ${hashedPassword}, 'admin')
      ON CONFLICT (username) DO NOTHING
    `;

        // Create Indexes
        await sql`CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_contents_featured ON contents(is_featured)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_episodes_content ON episodes(content_id)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_chapters_content ON chapters(content_id)`;

        return NextResponse.json({ message: 'Database Postgres berhasil diinisialisasi' });
    } catch (error) {
        console.error('Setup DB error:', error);
        return NextResponse.json({ error: 'Gagal inisialisasi database: ' + error.message }, { status: 500 });
    }
}
