-- Create page_views table
CREATE TABLE page_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    chapter_index INTEGER NOT NULL,
    sub_chapter_index INTEGER NOT NULL,
    is_logged_in BOOLEAN NOT NULL,
    time_spent INTEGER, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies for page_views
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert page views
CREATE POLICY "Allow anyone to insert page views"
    ON page_views
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Only allow authenticated users to view their own page views
CREATE POLICY "Users can view their own page views"
    ON page_views
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_page_views_updated_at
    BEFORE UPDATE ON page_views
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 