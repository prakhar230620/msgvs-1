-- FIX ADMIN ACCESS
-- Run this script in your Supabase Dashboard > SQL Editor

-- 1. Replace 'YOUR_EMAIL_HERE' with your actual email address
-- 2. Run the script

DO $$
DECLARE
  target_email TEXT := 'vidhyachoure17@gmail.com'; -- <--- PUT YOUR EMAIL HERE
  user_id UUID;
BEGIN
  -- Get the User ID from auth.users
  SELECT id INTO user_id FROM auth.users WHERE email = target_email;

  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found in auth.users. Please sign up first.', target_email;
  END IF;

  -- Insert or Update admin_users
  INSERT INTO public.admin_users (id, email, role, full_name)
  VALUES (user_id, target_email, 'super_admin', 'Admin User')
  ON CONFLICT (id) DO UPDATE
  SET role = 'super_admin';

  RAISE NOTICE 'Admin access granted to %', target_email;
END $$;
