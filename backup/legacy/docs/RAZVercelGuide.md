# Panduan Deployment EntRAZ ke Vercel

## 🚀 Status Migrasi: Selesai
Project ini telah dimigrasikan dari SQLite (`better-sqlite3`) ke **Vercel Postgres** (`@vercel/postgres`). Kode saat ini sudah menggunakan query asinkron dan siap di-deploy ke Vercel.

---

## Langkah-langkah Deployment ke Vercel

### Langkah 1: Persiapan Repository
Pastikan semua perubahan terbaru sudah di-push ke GitHub.

### Langkah 2: Buat Project di Vercel
1. Login ke [Vercel Dashboard](https://vercel.com).
2. Klik **"Add New..."** -> **"Project"**.
3. Import repository **EntRAZ** dari GitHub Anda.
4. Di bagian **"Framework Preset"**, pilih **Next.js**.

### Langkah 3: Setup Database (Vercel Postgres)
1. Di halaman konfigurasi project Vercel, buka tab **Storage**.
2. Klik **"Create Database"** -> Pilih **Postgres**.
3. Ikuti langkah pembuatan (Region: pilih yang terdekat, misal Singapore `sin1`).
4. Setelah dibuat, klik **"Connect"** agar Vercel otomatis menambahkan Environment Variables (`POSTGRES_URL`, dll) ke project Anda.

### Langkah 4: Environment Variables (Manual)
Di menu **Settings** -> **Environment Variables** di Vercel, pastikan variabel berikut ada:
- `JWT_SECRET`: Isi dengan string acak yang panjang (contoh: `RAZ_SECRET_KEY_2026`).
- (Opsional) `NODE_ENV`: `production`.

### Langkah 5: Inisialisasi Database (Setup Tables)
Setelah berhasil deploy (status: *Success*), Anda **WAJIB** membuat tabel di database Postgres.
1. Buka browser dan akses: `https://your-project.vercel.app/api/setup-db`
2. Jika berhasil, akan muncul pesan: `"Database Postgres berhasil diinisialisasi"`.
3. Script ini juga membuat **Akun Admin Default**:
   - Username: `admin`
   - Password: `admin123`

### Langkah 6: Verifikasi
Akses dashboard admin dan coba login dengan akun default. Jika berhasil masuk, migrasi telah sukses 100%.

---

## Catatan Teknis
- **Driver**: `@vercel/postgres`
- **Logic**: Semua query database sekarang bersifat asinkron (`await query(...)`).
- **Wrapper**: Terletak di `src/lib/RAZDatabasePostgres.js`.
- **Seeding**: Data genre default otomatis dimasukkan saat menjalankan `/api/setup-db`.

> [!IMPORTANT]
> Jangan lupa untuk login ke dashboard admin dan **Ganti Password Admin** segera setelah inisialisasi.
