/**
 * ============================================================
 * RAZDatabasePostgres.js - Database Engine untuk Vercel Postgres
 * ============================================================
 * Terakhir diperbarui: 2026-02-18
 * Versi: 1.0.0
 * 
 * Deskripsi:
 * File ini mengatur koneksi ke Vercel Postgres.
 * Menggunakan @vercel/postgres untuk lingkungan serverless.
 * ============================================================
 */

import { sql } from '@vercel/postgres';

/**
 * query - Helper function untuk menjalankan query SQL
 * @param {string} text - Query SQL
 * @param {array} params - Parameter untuk query
 * @returns {object} Hasil query (rows, rowCount, dll)
 */
export async function query(text, params = []) {
    try {
        const start = Date.now();
        const res = await sql.query(text, params);
        const duration = Date.now() - start;

        // Log query hanya di development
        if (process.env.NODE_ENV === 'development') {
            console.log('Executed query', { text, duration, rows: res.rowCount });
        }

        return res;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

/**
 * getDatabase - Mengembalikan object sql dari @vercel/postgres
 * Digunakan untuk kompatibilitas atau akses langsung
 */
export function getDatabase() {
    return sql;
}

export default {
    query,
    getDatabase
};
