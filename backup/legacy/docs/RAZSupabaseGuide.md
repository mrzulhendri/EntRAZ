# Panduan Deployment EntRAZ ke Supabase

Project EntRAZ kini mendukung **Supabase** sebagai engine database utama. Ikuti panduan ini untuk melakukan migrasi atau setup awal.

## 🛠️ Langkah 1: Persiapan Supabase
1. Buat akun dan project baru di [Supabase Dashboard](https://supabase.com).
2. Salin **Project URL** dan **API Key (anon/public)**.
3. Buka tab **Settings -> Database** dan cari bagian **Connection String**.
4. Pilih mode **Transaction** (biasanya port 6543) dan salin URL-nya.

## 🔑 Langkah 2: Konfigurasi Environment Variables
Tambahkan variabel berikut ke file `.env.local` atau ke Environment Variables provider hosting Anda (Vercel/Netlify):

```env
# Database Connection (Raw SQL)
DATABASE_URL="postgres://postgres.[USERNAME]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Client (SDK)
NEXT_PUBLIC_SUPABASE_URL="https://your-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# JWT Auth
JWT_SECRET="RAZ_SECRET_KEY_2026"
```

## 🚀 Langkah 3: Inisialisasi Tabel
Setelah variabel di atas dikonfigurasi, jalankan skrip inisialisasi untuk membuat semua tabel (Users, Contents, etc):

1. Jalankan aplikasi secara lokal atau deploy.
2. Akses URL: `[URL_DOMAIN]/api/setup-db`.
3. Tunggu hingga muncul pesan sukses: `"Database Supabase berhasil diinisialisasi"`.

## 📂 Langkah 4: Setup Storage (Opsional)
Jika Anda ingin menggunakan Supabase Storage untuk upload gambar:
1. Di Supabase Dashboard, buka tab **Storage**.
2. Buat bucket baru dengan nama `entraz-media`.
3. Set public access atau atur RLS policy sesuai kebutuhan.

---

### Catatan Penting:
- **Transaction Pooler**: Sangat disarankan untuk aplikasi serverless guna menghindari masalah kehabisan koneksi database.
- **Admin Default**: Setelah inisialisasi, user admin default adalah `admin` dengan password `admin123`.

> [!CAUTION]
> Selalu amankan `JWT_SECRET` Anda dan jangan pernah membagikan Connection String database ke publik.
