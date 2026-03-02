# RAZ Project Structure - EntRAZ Premium V2.1.0

```text
EntRAZ/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # Backend API Routes (Admin/Scraper)
│   │   ├── auth/           # Login & Register Pages
│   │   ├── tv/             # Live TV Module
│   │   ├── vod/            # Cinema / VOD Module
│   │   ├── comics/         # Comic Reader Module
│   │   ├── music/          # Music Player Module
│   │   ├── shorts/         # Vertical Shorts Module
│   │   ├── profile/        # User Profile & History
│   │   ├── superadmin/     # System Dashboard
│   │   └── layout.js       # Root Layout & Global State
│   ├── components/         # Reusable Premium UI Components
│   │   ├── Navigation.js   # Sidebar & Bottom Nav
│   │   ├── VideoPlayer.js  # HLS Video Engine
│   │   ├── AudioPlayer.js  # Global Music Engine
│   │   ├── ContentCard.js  # Unified Content Interface
│   │   └── AuthProvider.js # RBAC & Supabase Context
│   ├── lib/                # Logic & Engines
│   │   ├── supabase.js     # Supabase Client
│   │   ├── scraper.js      # Scraper Engine (Node/Cheerio)
│   │   └── utils.js        # Helper Utilities
│   └── styles/             # Styling & Themes
│       └── globals.css     # Tailwind & Custom Animations
├── docs/                   # Guides & SQL Schemas
│   ├── RAZSupabaseSchema.sql
│   ├── RAZVercelGuide.md
│   └── RAZSupabaseGuide.md
├── logs/                   # Activity Logs
│   └── 2026-03-02-UpdateHistory.md
├── backup/                 # Legacy Code Archive
├── next.config.mjs         # Build Configuration
└── tailwind.config.mjs     # Theme Configuration
```
