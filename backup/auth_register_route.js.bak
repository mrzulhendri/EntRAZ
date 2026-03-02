/**
 * ============================================================
 * Auth Register API - POST /api/auth/register
 * ============================================================
 * Terakhir diperbarui: 2026-02-17
 * Versi: 1.0.0
 * 
 * Endpoint untuk registrasi user baru.
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/RAZDatabase';
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

        const db = getDatabase();

        // Cek apakah username atau email sudah digunakan
        const existing = db.prepare(
            'SELECT id FROM users WHERE username = ? OR email = ?'
        ).get(username, email);

        if (existing) {
            return NextResponse.json(
                { error: 'Username atau email sudah terdaftar' },
                { status: 409 }
            );
        }

        // Hash password dan simpan user baru
        const password_hash = hashPassword(password);
        const result = db.prepare(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)'
        ).run(username, email, password_hash, 'user');

        const newUser = {
            id: result.lastInsertRowid,
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
