-- ==========================================
-- FINAL FIX V3: Includes Orphaned Orders Logic
-- ==========================================

-- 1. TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.link_orders_to_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Link orders where email matches AND (user_id is null OR user_id is orphaned)
  UPDATE public.orders
  SET user_id = NEW.id
  WHERE lower(trim(email)) = lower(trim(NEW.email))
  AND (
      user_id IS NULL 
      OR 
      user_id NOT IN (SELECT id FROM auth.users)
  );
  
  RETURN NEW;
END;
$$;

-- 2. RE-CREATE TRIGGER
DROP TRIGGER IF EXISTS trigger_link_orders_on_signup ON auth.users;

CREATE TRIGGER trigger_link_orders_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.link_orders_to_new_user();

-- 3. RPC FUNCTION (For Sync Button) WITH DEBUGGING
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
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
     RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT email INTO current_user_email FROM auth.users WHERE id = current_user_id;

  -- Update orders including orphaned ones
  WITH updated AS (
    UPDATE public.orders
    SET user_id = current_user_id
    WHERE lower(trim(email)) = lower(trim(current_user_email))
    AND (
      user_id IS NULL 
      OR 
      user_id NOT IN (SELECT id FROM auth.users)
    )
    RETURNING id
  )
  SELECT count(*) INTO affected_rows FROM updated;

  RETURN json_build_object('success', true, 'count', affected_rows, 'email', current_user_email);
END;
$$;

-- 4. IMMEDIATE FIX (Manual Run)
DO $$
BEGIN
  -- Fix NULLs
  UPDATE public.orders o
  SET user_id = u.id
  FROM auth.users u
  WHERE lower(trim(o.email)) = lower(trim(u.email))
  AND o.user_id IS NULL;

  -- Fix Orphans (where user_id refers to a deleted user)
  UPDATE public.orders o
  SET user_id = u.id
  FROM auth.users u
  WHERE lower(trim(o.email)) = lower(trim(u.email))
  AND o.user_id NOT IN (SELECT id FROM auth.users);
END $$;
