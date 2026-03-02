# RAZ Project Structure - EntRAZ

## Root Directory
- `src/` - Source code utama
- `public/` - Static assets
- `data/` - Database lokal SQLite (`entraz.db`) - *Legacy/Development only*
- `backup/` - Berisi cadangan file penting sebelum update besar

## Source Code (`src/`)

### App Router (`src/app/`)
... (tidak berubah)

#### API Routes (`src/app/api/`)
- `auth/` - Login, Register, Me (Postgres Ready)
- `contents/` - CRUD Content, Episodes, Chapters (Postgres Ready)
- `scraper/` - Preview, Import, Check Links
- `user/` - History, Bookmarks
- `admin/` - Stats, Settings [NEW], Reports [NEW]
- `setup-db/` - Inisialisasi Database Postgres (Postgres ONLY)

### Libraries (`src/lib/`)
- `RAZDatabasePostgres.js` - [NEW] Wrapper koneksi Vercel Postgres (Asinkron)
- `RAZDatabase.js` - [LOCAL] SQLite connection & schema (Sinkron)
- `RAZAuth.js` - JWT auth utilities
- `RAZScraper.js` - Cheerio web scraper engine
