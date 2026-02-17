# RAZ Project Structure - EntRAZ

## Root Directory
- `src/` - Source code utama
- `public/` - Static assets
- `data/` - Database SQLite (`entraz.db`)

## Source Code (`src/`)

### App Router (`src/app/`)
- `layout.js` - Root layout dengan TV Navigation
- `page.js` - Homepage
- `globals.css` - Tailwind base (reset)
- `RAZGlobals.css` - Global styles public site
- `RAZTVMode.css` - Styles untuk TV mode

#### Admin Panel (`src/app/admin/`)
- `layout.js` - Admin layout (Sidebar)
- `page.js` - Dashboard
- `contents/` - Content management (List, Create, Edit)
- `scraper/` - Web scraper interface
- `users/` - User management
- CSS: `RAZAdminLayout.css`, `RAZAdminDashboard.css`, `RAZAdminContent.css`, `RAZAdminScraper.css`

#### Public Pages
- `browse/` - Content browsing (Grid, Filter)
- `detail/[id]/` - Content detail info
- `watch/[id]/` - Video player
- `read/[id]/` - Comic reader
- `novel/[id]/` - Novel reader
- CSS: `RAZDetail.css`, `RAZPlayer.css`, `RAZReader.css`

#### User System (`src/app/user/`)
- `login/` - Login page
- `register/` - Register page
- `profile/` - User profile
- `history/` - Watch history
- `settings/` - Account settings

#### API Routes (`src/app/api/`)
- `auth/` - Login, Register, Me
- `contents/` - CRUD Content, Episodes, Chapters
- `scraper/` - Preview, Import, Check Links
- `user/` - History, Bookmarks
- `admin/` - Stats

### Libraries (`src/lib/`)
- `RAZDatabase.js` - SQLite connection & schema
- `RAZAuth.js` - JWT auth utilities
- `RAZScraper.js` - Cheerio web scraper engine

### Components (`src/app/components/`)
- `TVNavigation.js` - Android TV remote handler
