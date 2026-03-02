/**
 * ============================================================
 * Auth Register API - POST /api/auth/register
 * ============================================================
 * Terakhir diperbarui: 2026-02-18
 * Versi: 1.1.0
 * 
 * Endpoint untuk registrasi user baru.
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/RAZDatabasePostgres';
import { generateToken, hashPassword } from '@/lib/RAZAuth';

export async function POST(request) {
    try {
        const { username, email, password } = await request.json();

        // Validasi input
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: 'Username, email, dan password wajib diisi' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password minimal 6 karakter' },
                { status: 400 }
            );
        }

        // Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Format email tidak valid' },
                { status: 400 }
            );
        }

        // Cek apakah username atau email sudah digunakan di Postgres
        const existingRes = await query(
            'SELECT id FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (existingRes.rowCount > 0) {
            return NextResponse.json(
                { error: 'Username atau email sudah terdaftar' },
                { status: 409 }
            );
        }

        // Hash password dan simpan user baru
        const password_hash = hashPassword(password);
        const insertRes = await query(
            'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
            [username, email, password_hash, 'user']
        );

        const newUser = {
            id: insertRes.rows[0].id,
            username,
            email,
            role: 'user',
        };

        // Buat JWT token untuk auto-login setelah registrasi
        const token = generateToken(newUser);

        return NextResponse.json({
            token,
            user: newUser,
        }, { status: 201 });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}
