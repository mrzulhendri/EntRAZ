/**
 * ============================================================
 * RAZDatabasePostgres.js - Database Engine untuk Supabase
 * ============================================================
 * Terakhir diperbarui: 2026-03-02
 * Versi: 2.0.0
 * 
 * Deskripsi:
 * Mengatur koneksi ke Supabase Postgres menggunakan:
 * 1. pg (node-postgres) untuk raw SQL queries (lebih fleksibel).
 * 2. @supabase/supabase-js untuk fitur storage, auth, dan real-time.
 * 
 * PENTING: Gunakan connection string dari Supabase (Transaction Pooler).
 * ============================================================
 */

import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

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
 * supabase - Instance Supabase Client (singleton)
 */
let supabaseInstance = null;

export function getSupabase() {
    if (!supabaseInstance) {
        const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
            supabaseInstance = createClient(supabaseUrl, supabaseKey);
        } else {
            console.warn('Supabase URL atau Key tidak ditemukan. Fitur Supabase Client akan dinonaktifkan.');
        }
    }
    return supabaseInstance;
}

export const supabase = getSupabase();

export default { query, getDatabase, getSupabase, supabase };
