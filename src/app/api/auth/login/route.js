/**
 * ============================================================
 * Auth Login API - POST /api/auth/login
 * ============================================================
 * Terakhir diperbarui: 2026-02-17
 * Versi: 1.0.0
 * 
 * Endpoint untuk login user. Menerima username/email dan password,
 * mengembalikan JWT token jika berhasil.
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/RAZDatabase';
import { generateToken, comparePassword } from '@/lib/RAZAuth';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // Validasi input
        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username/email dan password wajib diisi' },
                { status: 400 }
            );
        }

        const db = getDatabase();

        // Cari user berdasarkan username atau email
        const user = db.prepare(
            'SELECT * FROM users WHERE username = ? OR email = ?'
        ).get(username, username);

        if (!user) {
            return NextResponse.json(
                { error: 'Username/email atau password salah' },
                { status: 401 }
            );
        }

        // Verifikasi password
        const isPasswordValid = comparePassword(password, user.password_hash);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Username/email atau password salah' },
                { status: 401 }
            );
        }

        // Buat JWT token
        const token = generateToken(user);

        // Kirim response (tanpa password_hash)
        return NextResponse.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}
