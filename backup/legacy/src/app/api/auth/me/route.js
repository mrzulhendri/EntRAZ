/**
 * ============================================================
 * Auth Me API - GET /api/auth/me
 * ============================================================
 * Terakhir diperbarui: 2026-02-18
 * Versi: 1.1.0
 * 
 * Endpoint untuk mendapatkan data user yang sedang login.
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/RAZDatabasePostgres';
import { authenticateRequest } from '@/lib/RAZAuth';

export async function GET(request) {
    try {
        const { user, error } = authenticateRequest(request);
        if (error) {
            return NextResponse.json({ error }, { status: 401 });
        }

        const res = await query(
            'SELECT id, username, email, role, avatar, created_at FROM users WHERE id = $1',
            [user.id]
        );

        const userData = res.rows[0];

        if (!userData) {
            return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
        }

        return NextResponse.json({ user: userData });
    } catch (error) {
        console.error('Auth me error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
