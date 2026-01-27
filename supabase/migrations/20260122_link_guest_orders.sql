-- Function to link existing guest orders to new user
CREATE OR REPLACE FUNCTION public.link_orders_to_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Update orders where email matches new user and user_id is null
  UPDATE public.orders
  SET user_id = NEW.id
  WHERE email = NEW.email
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
