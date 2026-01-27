-- Refresh Schema Cache
NOTIFY pgrst, 'reload schema';

-- Ensure columns exist (Idempotent)
DO $$ 
BEGIN 
    -- admin_response
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'admin_response') THEN
        ALTER TABLE public.quotes ADD COLUMN admin_response TEXT;
    END IF;

    -- description
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'description') THEN
        ALTER TABLE public.quotes ADD COLUMN description TEXT;
    END IF;

    -- quantity
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'quantity') THEN
        ALTER TABLE public.quotes ADD COLUMN quantity TEXT;
    END IF;

    -- file_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'file_url') THEN
        ALTER TABLE public.quotes ADD COLUMN file_url TEXT;
    END IF;

    -- contact_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'contact_name') THEN
        ALTER TABLE public.quotes ADD COLUMN contact_name TEXT;
    END IF;

    -- contact_email
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'contact_email') THEN
        ALTER TABLE public.quotes ADD COLUMN contact_email TEXT;
    END IF;

END $$;
