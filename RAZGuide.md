# RAZ Guide - EntRAZ Development

## Cara Menjalankan Project
1. Install dependencies: `npm install`
2. Jalankan development server: `npm run dev`
3. Buka browser: `http://localhost:3000`

## Akun Default
- **Admin**:
  - Username: `admin`
  - Password: `admin123` (password default dari seed database)

## Fitur Utama

### 1. Web Scraper
- Masuk ke Admin Panel > Web Scraper
- Masukkan URL dari situs sumber (contoh: web streaming/baca komik)
- Klik "Preview" untuk melihat metadata yang diambil
- Klik "Import" untuk menyimpan ke database
- **Catatan**: Scraper hanya menyimpan link/embed, tidak mendownload file video.

### 2. Admin Panel
- **Dashboard**: Statistik konten dan user
- **Manage Content**: Tambah/Edit/Hapus konten film, anime, komik, novel
- **Link Monitor**: Cek status link scraper (Active/Offline)

### 3. User System
- Register akun baru
- Login untuk menyimpan history tontonan/bacaan
- Profile page untuk melihat history

### 4. TV Remote Support
- Navigasi menggunakan tombol panah keyboard (simulasi remote)
- Fokus element akan terlihat dengan outline tebal
- Tombol Backspace/Escape untuk kembali

## Database
- Menggunakan **SQLite** (`data/entraz.db`)
- Tidak perlu install software database tambahan
- File database akan otomatis dibuat saat pertama kali dijalankan
