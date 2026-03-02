/**
 * ============================================================
 * RAZDatabase.js - Database Engine untuk EntRAZ
 * ============================================================
 * Terakhir diperbarui: 2026-02-17
 * Versi: 1.0.0
 * 
 * Deskripsi:
 * File ini mengatur koneksi dan inisialisasi database SQLite.
 * Semua tabel dibuat otomatis saat pertama kali dijalankan.
 * 
 * Tabel yang dibuat:
 * - users: Data pengguna (admin & user biasa)
 * - contents: Data konten (film, anime, komik, novel, dll)
 * - episodes: Episode untuk konten video (film, anime, donghua)
 * - chapters: Chapter untuk konten komik/manga/manwa
 * - novel_chapters: Chapter untuk novel (teks)
 * - scraper_sources: Sumber web scraper
 * - user_history: Riwayat tonton/baca user
 * - bookmarks: Bookmark/favorit user
 * - genres: Daftar genre
 * - content_genres: Relasi konten-genre (many-to-many)
 * ============================================================
 */

import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

// Lokasi file database SQLite
const DB_PATH = path.join(process.cwd(), 'data', 'entraz.db');

// Variabel singleton untuk koneksi database
let db = null;

/**
 * getDatabase - Mendapatkan koneksi database (singleton pattern)
 * Jika belum ada koneksi, buat baru dan inisialisasi tabel
 * @returns {Database} Instance database SQLite
 */
export function getDatabase() {
  if (db) return db;

  // Pastikan folder 'data' ada
  const fs = require('fs');
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Buat koneksi database baru
  db = new Database(DB_PATH);

  // Aktifkan WAL mode untuk performa lebih baik
  db.pragma('journal_mode = WAL');
  // Aktifkan foreign keys
  db.pragma('foreign_keys = ON');

  // Inisialisasi semua tabel
  initializeTables(db);

  return db;
}

/**
 * initializeTables - Membuat semua tabel yang dibutuhkan
 * Menggunakan IF NOT EXISTS agar aman dijalankan berulang kali
 * @param {Database} db - Instance database
 */
function initializeTables(db) {
  // === TABEL USERS ===
  // Menyimpan data pengguna, baik admin maupun user biasa
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
      avatar TEXT DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // === TABEL CONTENTS ===
  // Menyimpan semua jenis konten (film, anime, komik, novel, dll)
  db.exec(`
    CREATE TABLE IF NOT EXISTS contents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      alternative_title TEXT DEFAULT '',
      type TEXT NOT NULL CHECK(type IN ('movie', 'anime', 'donghua', 'comic', 'manga', 'manwa', 'novel', 'series')),
      description TEXT DEFAULT '',
      cover_image TEXT DEFAULT '',
      banner_image TEXT DEFAULT '',
      status TEXT DEFAULT 'ongoing' CHECK(status IN ('ongoing', 'completed', 'hiatus', 'cancelled')),
      rating REAL DEFAULT 0,
      year INTEGER DEFAULT NULL,
      author TEXT DEFAULT '',
      studio TEXT DEFAULT '',
      country TEXT DEFAULT '',
      source_type TEXT DEFAULT 'manual' CHECK(source_type IN ('manual', 'scraper')),
      is_featured INTEGER DEFAULT 0,
      view_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // === TABEL EPISODES ===
  // Untuk konten video (film, anime, donghua, series)
  db.exec(`
    CREATE TABLE IF NOT EXISTS episodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_id INTEGER NOT NULL,
      season INTEGER DEFAULT 1,
      episode_number INTEGER NOT NULL,
      title TEXT DEFAULT '',
      video_url TEXT NOT NULL,
      thumbnail TEXT DEFAULT '',
      duration TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
    )
  `);

  // === TABEL CHAPTERS ===
  // Untuk konten bergambar (komik, manga, manwa)
  db.exec(`
    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_id INTEGER NOT NULL,
      chapter_number REAL NOT NULL,
      title TEXT DEFAULT '',
      pages TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
    )
  `);

  // === TABEL NOVEL CHAPTERS ===
  // Untuk konten novel (teks panjang)
  db.exec(`
    CREATE TABLE IF NOT EXISTS novel_chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_id INTEGER NOT NULL,
      chapter_number REAL NOT NULL,
      title TEXT DEFAULT '',
      text_content TEXT DEFAULT '',
      word_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
    )
  `);

  // === TABEL SCRAPER SOURCES ===
  // Menyimpan sumber URL untuk web scraper
  db.exec(`
    CREATE TABLE IF NOT EXISTS scraper_sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_id INTEGER DEFAULT NULL,
      source_url TEXT NOT NULL,
      scraper_type TEXT DEFAULT 'auto',
      last_checked DATETIME DEFAULT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'offline', 'error', 'pending')),
      error_message TEXT DEFAULT '',
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE SET NULL
    )
  `);

  // === TABEL USER HISTORY ===
  // Riwayat tonton/baca pengguna
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content_id INTEGER NOT NULL,
      episode_id INTEGER DEFAULT NULL,
      chapter_id INTEGER DEFAULT NULL,
      progress REAL DEFAULT 0,
      history_type TEXT DEFAULT 'watch' CHECK(history_type IN ('watch', 'read')),
      last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
    )
  `);

  // === TABEL BOOKMARKS ===
  // Konten yang disimpan/difavoritkan pengguna
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
      UNIQUE(user_id, content_id)
    )
  `);

  // === TABEL GENRES ===
  // Daftar genre yang tersedia
  db.exec(`
    CREATE TABLE IF NOT EXISTS genres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL
    )
  `);

  // === TABEL CONTENT_GENRES ===
  // Relasi many-to-many antara konten dan genre
  db.exec(`
    CREATE TABLE IF NOT EXISTS content_genres (
      content_id INTEGER NOT NULL,
      genre_id INTEGER NOT NULL,
      PRIMARY KEY (content_id, genre_id),
      FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
      FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
    )
  `);

  // === SEED DATA: Genre Default ===
  // Masukkan genre default jika belum ada
  const genreCount = db.prepare('SELECT COUNT(*) as count FROM genres').get();
  if (genreCount.count === 0) {
    const defaultGenres = [
      { name: 'Action', slug: 'action' },
      { name: 'Adventure', slug: 'adventure' },
      { name: 'Comedy', slug: 'comedy' },
      { name: 'Drama', slug: 'drama' },
      { name: 'Fantasy', slug: 'fantasy' },
      { name: 'Horror', slug: 'horror' },
      { name: 'Mystery', slug: 'mystery' },
      { name: 'Romance', slug: 'romance' },
      { name: 'Sci-Fi', slug: 'sci-fi' },
      { name: 'Thriller', slug: 'thriller' },
      { name: 'Slice of Life', slug: 'slice-of-life' },
      { name: 'Supernatural', slug: 'supernatural' },
      { name: 'Martial Arts', slug: 'martial-arts' },
      { name: 'Isekai', slug: 'isekai' },
      { name: 'Mecha', slug: 'mecha' },
      { name: 'Sports', slug: 'sports' },
      { name: 'Music', slug: 'music' },
      { name: 'Historical', slug: 'historical' },
      { name: 'Psychological', slug: 'psychological' },
      { name: 'School', slug: 'school' },
      { name: 'Harem', slug: 'harem' },
      { name: 'Ecchi', slug: 'ecchi' },
    ];

    const insertGenre = db.prepare('INSERT INTO genres (name, slug) VALUES (?, ?)');
    const insertMany = db.transaction((genres) => {
      for (const genre of genres) {
        insertGenre.run(genre.name, genre.slug);
      }
    });
    insertMany(defaultGenres);
  }

  // === SEED DATA: Admin Default ===
  // Buat akun admin default jika belum ada
  const adminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get();
  if (adminCount.count === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)'
    ).run('admin', 'admin@entraz.local', hashedPassword, 'admin');
  }

  // === INDEX untuk performa query ===
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);
    CREATE INDEX IF NOT EXISTS idx_contents_featured ON contents(is_featured);
    CREATE INDEX IF NOT EXISTS idx_episodes_content ON episodes(content_id);
    CREATE INDEX IF NOT EXISTS idx_chapters_content ON chapters(content_id);
    CREATE INDEX IF NOT EXISTS idx_novel_chapters_content ON novel_chapters(content_id);
    CREATE INDEX IF NOT EXISTS idx_user_history_user ON user_history(user_id);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
    CREATE INDEX IF NOT EXISTS idx_scraper_sources_content ON scraper_sources(content_id);
    CREATE INDEX IF NOT EXISTS idx_scraper_sources_status ON scraper_sources(status);
  `);
}

export default getDatabase;
