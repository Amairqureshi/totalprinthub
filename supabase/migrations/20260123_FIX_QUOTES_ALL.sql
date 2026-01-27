-- ==========================================
-- 1. SETUP STORAGE (For Image Uploads)
-- ==========================================
-- Create bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow PUBLIC access to uploads (Simplest for now)
DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public Reads" ON storage.objects;

CREATE POLICY "Public Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Public Reads" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'uploads');

-- ==========================================
-- 2. SETUP QUOTES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    type TEXT NOT NULL CHECK (type IN ('new', 'existing')),
    product_name TEXT DEFAULT 'Custom Project',
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    
    -- New Detailed Fields
    material TEXT,
    size TEXT,
    finish TEXT,
    quantity TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    
    details JSONB DEFAULT '{}'::jsonb, -- Backup for extra fields
    status TEXT NOT NULL DEFAULT 'pending',
    admin_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. ENABLE PERMISSIONS (RLS)
-- ==========================================
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Allow ANYONE (auth or anon) to insert quotes? 
-- User said "Dashboard me dikhana chahiye" -> implied logged in.
-- But we should allow insert if user is set.

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.quotes;
CREATE POLICY "Enable insert for authenticated users only" 
ON public.quotes FOR INSERT 
TO authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read for users own quotes" ON public.quotes;
CREATE POLICY "Enable read for users own quotes" 
ON public.quotes FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);
