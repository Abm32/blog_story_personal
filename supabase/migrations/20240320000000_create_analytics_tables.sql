-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create page_views table if it doesn't exist
CREATE TABLE IF NOT EXISTS page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    chapter_index INTEGER NOT NULL,
    sub_chapter_index INTEGER NOT NULL,
    is_logged_in BOOLEAN NOT NULL,
    time_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create anonymous_page_views table if it doesn't exist
CREATE TABLE IF NOT EXISTS anonymous_page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chapter_index INTEGER NOT NULL,
    sub_chapter_index INTEGER NOT NULL,
    time_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_page_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow anyone to insert page views" ON page_views;
DROP POLICY IF EXISTS "Users can view own page views" ON page_views;
DROP POLICY IF EXISTS "Allow anonymous page views" ON anonymous_page_views;

-- Create policies for profiles
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Create policies for page_views
CREATE POLICY "Allow anyone to insert page views"
    ON page_views FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view own page views"
    ON page_views FOR SELECT
    USING (auth.uid() = user_id);

-- Create policies for anonymous_page_views
CREATE POLICY "Allow anonymous page views"
    ON anonymous_page_views FOR INSERT
    WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_page_views_updated_at ON page_views;
DROP TRIGGER IF EXISTS update_anonymous_page_views_updated_at ON anonymous_page_views;

-- Create triggers
CREATE TRIGGER update_page_views_updated_at
    BEFORE UPDATE ON page_views
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_anonymous_page_views_updated_at
    BEFORE UPDATE ON anonymous_page_views
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 