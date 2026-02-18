/**
 * ============================================================
 * RAZDatabasePostgres.js - Database Engine untuk Supabase Postgres
 * ============================================================
 * Terakhir diperbarui: 2026-02-18
 * Versi: 1.2.0
 * 
 * Deskripsi:
 * File ini mengatur koneksi ke Supabase Postgres menggunakan
 * library `pg` (node-postgres). Cocok untuk lingkungan serverless
 * seperti Vercel maupun VPS tradisional.
 * 
 * PENTING: Gunakan POSTGRES_URL_NON_POOLING untuk menghindari
 * masalah kompatibilitas PgBouncer dengan prepared statements.
 * ============================================================
 */

import pg from 'pg';
const { Pool } = pg;

// Buat connection pool (singleton)
let pool;

/**
 * getPool - Mendapatkan instance Pool (singleton pattern)
 * Prioritas connection string:
 * 1. POSTGRES_URL_NON_POOLING (direct connection, paling kompatibel)
 * 2. POSTGRES_URL (pooled connection)
 * 3. DATABASE_URL (fallback umum)
 */
function getPool() {
    if (!pool) {
        // Gunakan non-pooling URL untuk kompatibilitas terbaik dengan pg
        const connectionString =
            process.env.POSTGRES_URL_NON_POOLING ||
            process.env.POSTGRES_URL ||
            process.env.DATABASE_URL;

        if (!connectionString) {
            throw new Error(
                'Database connection string tidak ditemukan. ' +
                'Pastikan POSTGRES_URL_NON_POOLING atau POSTGRES_URL sudah di-set.'
            );
        }

        pool = new Pool({
            connectionString,
            ssl: {
                rejectUnauthorized: false // Diperlukan untuk Supabase
            },
            max: 5,                      // Maks 5 koneksi (hemat untuk serverless)
            idleTimeoutMillis: 20000,     // Timeout idle 20 detik
            connectionTimeoutMillis: 15000, // Timeout koneksi baru 15 detik
        });

        // Handle error pada pool level
        pool.on('error', (err) => {
            console.error('Database pool error:', err);
        });
    }
    return pool;
}

/**
 * query - Helper function untuk menjalankan query SQL
 * @param {string} text - Query SQL (gunakan $1, $2, dst untuk parameter)
 * @param {array} params - Parameter untuk query
 * @returns {object} Hasil query { rows, rowCount }
 */
export async function query(text, params = []) {
    const p = getPool();
    try {
        const start = Date.now();
        const res = await p.query(text, params);
        const duration = Date.now() - start;

        // Log query hanya di development untuk debugging
        if (process.env.NODE_ENV === 'development') {
            console.log('Executed query', { text: text.substring(0, 80), duration, rows: res.rowCount });
        }

        return res;
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
}

/**
 * getDatabase - Mengembalikan instance Pool
 */
export function getDatabase() {
    return getPool();
}

export default { query, getDatabase };
