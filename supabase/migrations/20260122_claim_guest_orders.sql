-- Secure Function to Claim Guest Orders
-- This allows a logged-in user to checking for and "claim" any guest orders matching their email.

CREATE OR REPLACE FUNCTION public.claim_guest_orders()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with admin privileges to update orders they don't own yet
SET search_path = public -- Security best practice
AS $$
DECLARE
  current_user_id uuid;
  current_user_email text;
  affected_rows int;
BEGIN
  -- Get current authenticated user
  current_user_id := auth.uid();
  
  -- If not logged in, return error
  IF current_user_id IS NULL THEN
     RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get user email directly from auth.users (trusted source)
  SELECT email INTO current_user_email FROM auth.users WHERE id = current_user_id;

  -- Update orders
  WITH updated AS (
    UPDATE public.orders
    SET user_id = current_user_id
    WHERE lower(trim(email)) = lower(trim(current_user_email)) -- Case & whitespace insensitive match
    AND user_id IS NULL
    RETURNING id
  )
  SELECT count(*) INTO affected_rows FROM updated;

  RETURN json_build_object('success', true, 'count', affected_rows);
END;
$$;
