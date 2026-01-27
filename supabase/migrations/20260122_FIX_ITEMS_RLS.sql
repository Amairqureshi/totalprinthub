-- ==========================================
-- FIX: Allow Users to SEE their order ITEMS
-- ==========================================

-- Enable RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;

-- Create Policy: View items if the parent order belongs to you
CREATE POLICY "Users can view own order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
);

-- Force cache refresh (sometimes needed)
NOTIFY pgrst, 'reload schema';
