# Panduan Deployment EntRAZ ke Vercel

## ⚠️ PERHATIAN PENTING: Database SQLite
Project ini saat ini menggunakan **SQLite** (`better-sqlite3`) yang menyimpan data dalam file lokal (`data/entraz.db`).
**Vercel adalah platform Serverless**, artinya file sistem tidak persisten. Jika Anda deploy kode ini *apa adanya* ke Vercel:
1. Website akan berjalan.
2. Namum, data (User, Content, History) **akan hilang** setiap kali server restart (cold start) atau redeploy.
3. `better-sqlite3` mungkin gagal di-build karena ketergantungan native module.

### Solusi yang Disarankan
Untuk deploy ke Vercel, Anda **HARUS** migrasi database dari SQLite ke service database cloud seperti:
1. **Vercel Postgres** (Paling mudah integrasinya)
2. **Neon** / **Supabase** / **Turso**
3. **CockroachDB**

---

## Opsi 1: Deploy ke VPS (Jika ingin tetap pakai SQLite)
Jika Anda tidak ingin mengubah kode database dan tetap ingin pakai SQLite, disarankan deploy ke **VPS** (seperti DigitalOcean, Linode) atau **Railway** (dengan Volume storage).
- **Railway**: Bisa deploy repo GitHub langsung. Perlu setting "Volume" agar database tidak hilang.
- **Coolify / VPS**: Bisa self-host via Docker.

---

## Opsi 2: Deploy ke Vercel (Migrasi ke Vercel Postgres)

Berikut adalah panduan lengkap jika Anda memilih migrasi ke Vercel:

### Langkah 1: Persiapan Repository
Pastikan kode sudah di-push ke GitHub (sudah dilakukan di langkah sebelumnya).

### Langkah 2: Buat Project di Vercel
1. Login ke [Vercel Dashboard](https://vercel.com).
2. Klik **"Add New..."** -> **"Project"**.
3. Import repository **EntRAZ** dari GitHub Anda.
4. Di bagian **"Framework Preset"**, pilih **Next.js**.

### Langkah 3: Setup Database (Vercel Postgres)
1. Di halaman konfigurasi project Vercel, buka tab **Storage** (atau buat project dulu lalu ke Storage).
2. Klik **"Create Database"** -> Pilih **Postgres**.
3. Ikuti langkah pembuatan (Region: pilih yang terdekat, misal Singapore `sin1`).
4. Setelah dibuat, Vercel otomatis menambahkan Environment Variables (`POSTGRES_URL`, dll) ke project Anda.

### Langkah 4: Update Kode Database (`src/lib/RAZDatabase.js`)
Anda perlu mengubah driver database dari `better-sqlite3` menjadi `@vercel/postgres`.
*(Jika Anda setuju, saya bisa bantu buatkan file `RAZDatabasePostgres.js` untuk migrasi ini).*

Contoh perubahan kode:
```javascript
// SEBELUM (SQLite)
const db = require('better-sqlite3')('data/entraz.db');

// SESUDAH (Postgres)
import { sql } from '@vercel/postgres';
// Query juga harus disesuaikan dari synchronous menjadi asynchronous (await)
```

### Langkah 5: Environment Variables
Di menu **Settings** -> **Environment Variables** di Vercel, tambahkan:
- `JWT_SECRET`: Isi dengan string acak yang panjang dan aman (contoh: `rahasia_super_aman_123`).

### Langkah 6: Deploy
1. Klik **"Deploy"**.
2. Tunggu proses build selesai.
3. Jika ada error terkait `better-sqlite3`, Anda mungkin perlu menghapus dependency tersebut dari `package.json` jika sudah pindah ke Postgres.

### Langkah 7: Inisialisasi Tabel
Setelah deploy, Anda perlu menjalankan script untuk membuat tabel di Postgres. Bisa dibuatkan route khusus `/api/setup-db` yang dijalankan sekali via browser.

---

## Ringkasan
- **Project saat ini**: Siap jalan di Local / VPS.
- **Untuk Vercel**: Perlu migrasi database ke Postgres.

**Rekomendasi**: Jika ini hanya untuk demo portofolio, deploy ke **Railway** atau **Render** mungkin lebih cepat karena support Docker/SQLite (dengan caveat storage). Tapi untuk production scale, **Vercel + Postgres** adalah pilihan terbaik.
