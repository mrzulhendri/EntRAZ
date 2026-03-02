# RAZ Update History - 2026-02-18

## Versi 1.1.0 (Released) - Migrasi Postgres & Build Fixes
**Kegiatan Hari Ini:**
1.  **Migrasi Database ke Vercel Postgres**
    - Berhasil migrasi dari SQLite (`better-sqlite3`) ke Vercel Postgres (`@vercel/postgres`).
    - Update seluruh API routes (`/api/auth`, `/api/contents`, dll) menjadi asinkron.
    - Membuat skrip inisialisasi database otomatis di `/api/setup-db`.

2.  **Debugging Build Vercel**
    - Memperbaiki error "Module not found" dengan standarisasi import path menggunakan alias `@/`.
    - Memperbaiki error Prerendering (Static Generation) dengan menambahkan `<Suspense>` pada halaman yang menggunakan `useSearchParams` (`/browse`, `/watch`, `/read`, `/novel`).
    - Konfigurasi `turbopack.root` di `next.config.mjs` untuk stabilitas build.

**Detail Perubahan:**
- [Fix] `src/app/admin/contents/[id]/page.js`: Fixed RAZModal import path.
- [Fix] `src/app/detail/[id]/page.js`: Fixed CSS import path.
- [Fix] `src/app/watch/[id]/page.js`: Fixed CSS import & added Suspense.
- [Fix] `src/app/read/[id]/page.js`: Fixed CSS import & added Suspense.
- [Fix] `src/app/novel/[id]/page.js`: Fixed CSS import & added Suspense.
- [Config] `.gitignore`: Added `EntRAZ/` and `backup/` to ignore list.
