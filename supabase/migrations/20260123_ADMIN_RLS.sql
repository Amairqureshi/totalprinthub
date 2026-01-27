-- Allow Admin to View All Quotes
CREATE POLICY "Enable read for admins" 
ON public.quotes FOR SELECT 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@totalprinthub.com');

-- Allow Admin to Update (Reply) to Quotes
CREATE POLICY "Enable update for admins" 
ON public.quotes FOR UPDATE
TO authenticated 
USING (auth.jwt() ->> 'email' = 'admin@totalprinthub.com')
WITH CHECK (auth.jwt() ->> 'email' = 'admin@totalprinthub.com');
