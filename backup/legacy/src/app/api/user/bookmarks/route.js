/**
 * ============================================================
 * User Bookmarks API - GET/POST/DELETE /api/user/bookmarks
 * ============================================================
 * Terakhir diperbarui: 2026-02-17
 * Versi: 1.0.0
 * 
 * Mengelola bookmark/favorit pengguna.
 * GET: Mengambil daftar bookmark
 * POST: Menambah bookmark
 * DELETE: Menghapus bookmark
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/RAZDatabase';
import { authenticateRequest } from '@/lib/RAZAuth';

export async function GET(request) {
    try {
        const { user, error } = authenticateRequest(request);
        if (error) return NextResponse.json({ error }, { status: 401 });

        const db = getDatabase();

        const bookmarks = db.prepare(`
      SELECT b.id, b.created_at, c.* 
      FROM bookmarks b
      JOIN contents c ON b.content_id = c.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `).all(user.id);

        return NextResponse.json({ bookmarks });
    } catch (error) {
        console.error('Get bookmarks error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { user, error } = authenticateRequest(request);
        if (error) return NextResponse.json({ error }, { status: 401 });

        const { content_id } = await request.json();

        if (!content_id) {
            return NextResponse.json({ error: 'Content ID wajib diisi' }, { status: 400 });
        }

        const db = getDatabase();

        // Insert ignore agar tidak error jika duplikat
        db.prepare(`
      INSERT OR IGNORE INTO bookmarks (user_id, content_id)
      VALUES (?, ?)
    `).run(user.id, content_id);

        return NextResponse.json({ success: true, message: 'Ditambahkan ke bookmark' });
    } catch (error) {
        console.error('Add bookmark error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { user, error } = authenticateRequest(request);
        if (error) return NextResponse.json({ error }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const content_id = searchParams.get('content_id');

        if (!content_id) {
            return NextResponse.json({ error: 'Content ID wajib diisi' }, { status: 400 });
        }

        const db = getDatabase();

        db.prepare(`
      DELETE FROM bookmarks WHERE user_id = ? AND content_id = ?
    `).run(user.id, content_id);

        return NextResponse.json({ success: true, message: 'Dihapus dari bookmark' });
    } catch (error) {
        console.error('Delete bookmark error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
