/**
 * ============================================================
 * RAZDatabasePostgres.js - Database Engine untuk Supabase Postgres
 * ============================================================
 * Terakhir diperbarui: 2026-02-18
 * Versi: 1.1.0
 * 
 * Deskripsi:
 * File ini mengatur koneksi ke Supabase Postgres menggunakan
 * library `pg` (node-postgres). Cocok untuk lingkungan serverless
 * seperti Vercel maupun VPS tradisional.
 * ============================================================
 */

import pg from 'pg';
const { Pool } = pg;

// Buat connection pool (singleton)
// Pool akan otomatis membaca POSTGRES_URL dari environment variables
let pool;

/**
 * getPool - Mendapatkan instance Pool (singleton pattern)
 * Pool akan dibuat hanya sekali dan digunakan ulang untuk
 * semua request, menghemat resource koneksi database.
 */
function getPool() {
    if (!pool) {
        const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

        if (!connectionString) {
            throw new Error(
                'Database connection string tidak ditemukan. ' +
                'Pastikan POSTGRES_URL atau DATABASE_URL sudah di-set di environment variables.'
            );
        }

        pool = new Pool({
            connectionString,
            ssl: {
                rejectUnauthorized: false // Diperlukan untuk Supabase
            },
            max: 10, // Maksimal 10 koneksi dalam pool
            idleTimeoutMillis: 30000, // Timeout koneksi idle 30 detik
            connectionTimeoutMillis: 10000, // Timeout koneksi baru 10 detik
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
 * 
 * Contoh penggunaan:
 *   const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
 *   console.log(result.rows); // Array of rows
 */
export async function query(text, params = []) {
    const pool = getPool();
    try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;

        // Log query hanya di development untuk debugging
        if (process.env.NODE_ENV === 'development') {
            console.log('Executed query', { text: text.substring(0, 80), duration, rows: res.rowCount });
        }

        return res;
    } catch (error) {
        console.error('Database query error:', error.message);
        console.error('Query:', text.substring(0, 200));
        throw error;
    }
}

/**
 * getDatabase - Mengembalikan instance Pool
 * Digunakan untuk kompatibilitas atau akses langsung
 */
export function getDatabase() {
    return getPool();
}

export default {
    query,
    getDatabase
};
