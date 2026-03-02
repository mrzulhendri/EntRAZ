-- RAZ EntRAZ Premium Database Schema
-- Last Updated: 2026-03-02

-- 1. Profiles & RBAC
CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'user');

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL, -- 'Film', 'Series', 'Anime', 'Comic', etc.
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Content (VOD, TV, Comic, Music)
CREATE TYPE content_type AS ENUM ('video', 'tv', 'comic', 'music', 'short');

CREATE TABLE contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  poster_url TEXT,
  type content_type NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  rating DECIMAL DEFAULT 0,
  views_count BIGINT DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}', -- Store specific info like 'artist', 'author', 'author_alias'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Media Sources (Links for Video, TV, Music)
CREATE TABLE media_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  label TEXT, -- 'HD', '720p', 'Server 1'
  source_url TEXT NOT NULL,
  source_type TEXT, -- 'hls', 'mp4', 'm3u8', 'm3u'
  is_main BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Chapters / Episodes (For Series & Comics)
CREATE TABLE content_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  title TEXT NOT NULL, -- 'Episode 1', 'Chapter 45'
  sort_order INTEGER NOT NULL,
  thumbnail_url TEXT,
  source_url TEXT, -- For simple link items
  metadata JSONB DEFAULT '{}', -- For comic images array: { "pages": ["url1", "url2"] }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Scrapers
CREATE TABLE scrapers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  target_url TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  selectors JSONB NOT NULL, -- { "title": ".title", "link": ".video a", "thumbnail": "img.poster" }
  frequency_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT TRUE,
  last_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) - Basic Setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Content is viewable by everyone" ON contents FOR SELECT USING (true);
CREATE POLICY "Admins can manage content" ON contents FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND (role = 'admin' OR role = 'superadmin')
  )
);
