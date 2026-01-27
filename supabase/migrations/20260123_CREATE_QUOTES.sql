-- Create Quotes Table
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id), -- Nullable (guest quotes possible, but we prefer auth)
    type TEXT NOT NULL CHECK (type IN ('new', 'existing')),
    product_name TEXT, -- For existing products
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb, -- Stores quantity, dims, description, file_urls
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'responded', 'converted', 'rejected')),
    admin_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Users can view their own quotes
CREATE POLICY "Users can view own quotes"
    ON quotes FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert quotes
CREATE POLICY "Users can create quotes"
    ON quotes FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Admin policies (assuming logic exists to check if admin, otherwise simple policy for now)
-- For now, just rely on Service Key for Admin Dashboard access.
