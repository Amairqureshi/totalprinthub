-- Function to link existing guest orders to new user (Case Insensitive)
CREATE OR REPLACE FUNCTION public.link_orders_to_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Update orders where email matches new user (case insensitive) and user_id is null
  UPDATE public.orders
  SET user_id = NEW.id
  WHERE lower(email) = lower(NEW.email)
  AND user_id IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop Trigger if exists to allow idempotency
DROP TRIGGER IF EXISTS trigger_link_orders_on_signup ON auth.users;

-- Trigger to run after new user creation
CREATE TRIGGER trigger_link_orders_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.link_orders_to_new_user();

-- FOR MANUAL FIX: Run this once if the user already signed up
-- Replace 'user_email@example.com' with the actual user's email if needed
-- But generally, the trigger handles future signups.
-- If the user ALREADY signed up and the trigger failed, they can run:
/*
UPDATE public.orders o
SET user_id = u.id
FROM auth.users u
WHERE lower(o.email) = lower(u.email)
AND o.user_id IS NULL;
*/
