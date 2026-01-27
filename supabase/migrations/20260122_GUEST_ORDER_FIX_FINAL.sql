-- ==========================================
-- 1. TRIGGER FUNCTION (Auto-Link on Signup)
-- ==========================================
CREATE OR REPLACE FUNCTION public.link_orders_to_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update orders where email matches new user (case insensitive) and user_id is null
  UPDATE public.orders
  SET user_id = NEW.id
  WHERE lower(trim(email)) = lower(trim(NEW.email))
  AND user_id IS NULL;
  
  RETURN NEW;
END;
$$;

-- ==========================================
-- 2. CREATE TRIGGER (Run after INSERT)
-- ==========================================
-- Drop first to ensure clean state
DROP TRIGGER IF EXISTS trigger_link_orders_on_signup ON auth.users;

CREATE TRIGGER trigger_link_orders_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.link_orders_to_new_user();

-- ==========================================
-- 3. RPC FUNCTION (Manual Sync Button)
-- ==========================================
CREATE OR REPLACE FUNCTION public.claim_guest_orders()
RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  current_user_id uuid;
  current_user_email text;
  affected_rows int;
BEGIN
  -- Get current authenticated user
  current_user_id := auth.uid();
  
  -- If not logged in, return count 0
  IF current_user_id IS NULL THEN
     RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Get user email directly from auth.users (trusted source)
  SELECT email INTO current_user_email FROM auth.users WHERE id = current_user_id;

  -- Update orders
  WITH updated AS (
    UPDATE public.orders
    SET user_id = current_user_id
    WHERE lower(trim(email)) = lower(trim(current_user_email))
    AND user_id IS NULL
    RETURNING id
  )
  SELECT count(*) INTO affected_rows FROM updated;

  RETURN json_build_object('success', true, 'count', affected_rows);
END;
$$;

-- ==========================================
-- 4. ONE-TIME FIX (For existing users)
-- ==========================================
-- This creates a temporary function to clean up ANY existing valid links
DO $$
BEGIN
  UPDATE public.orders o
  SET user_id = u.id
  FROM auth.users u
  WHERE lower(trim(o.email)) = lower(trim(u.email))
  AND o.user_id IS NULL;
END $$;
