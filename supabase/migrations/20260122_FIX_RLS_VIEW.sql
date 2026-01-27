-- ==========================================
-- FIX: Allow Users to SEE their orders
-- ==========================================

-- Enable RLS (just in case)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

-- Create the Policy
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Also allow them to Insert (if your checkout flow relies on client-side insert, though usually it's server-side)
-- But primarily we need SELECT.
