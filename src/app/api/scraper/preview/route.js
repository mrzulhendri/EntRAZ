/**
 * ============================================================
 * Scraper Preview API - POST /api/scraper/preview
 * ============================================================
 * Terakhir diperbarui: 2026-02-17
 * Versi: 1.0.0
 * 
 * Endpoint untuk preview konten dari URL tanpa menyimpan.
 * Admin memasukkan URL, scraper mengambil metadata dan
 * menampilkan preview sebelum import.
 * ============================================================
 */

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/RAZAuth';
import RAZScraper from '@/lib/RAZScraper';

export async function POST(request) {
    try {
        const { user, error } = requireAdmin(request);
        if (error) return NextResponse.json({ error }, { status: 403 });

        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL wajib diisi' }, { status: 400 });
        }

        // Validasi URL format
        try {
            new URL(url);
        } catch {
            return NextResponse.json({ error: 'Format URL tidak valid' }, { status: 400 });
        }

        // Jalankan scraper untuk preview
        const scraper = new RAZScraper(url);
        const preview = await scraper.preview();

        return NextResponse.json({ preview });
    } catch (error) {
        console.error('Scraper preview error:', error);
        return NextResponse.json(
            { error: `Gagal scraping: ${error.message}` },
            { status: 500 }
        );
    }
}
