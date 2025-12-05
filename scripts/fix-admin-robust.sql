-- FIX ADMIN ACCESS (ROBUST VERSION)
-- Run this ENTIRE script in Supabase SQL Editor

-- 1. Replace 'YOUR_EMAIL_HERE' with your exact email address
-- 2. Click RUN

BEGIN;

-- 1. Create the table if it doesn't exist (Safety check)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy to allow reading own data (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'admin_users' AND policyname = 'Allow users to read their own admin status'
    ) THEN
        CREATE POLICY "Allow users to read their own admin status"
        ON public.admin_users
        FOR SELECT
        USING (auth.uid() = id);
    END IF;
END
$$;

-- 4. Insert the Admin User
DO $$
DECLARE
  target_email TEXT := 'vidhyachoure17@gmail.com'; -- <--- ENTER YOUR EMAIL HERE
  target_user_id UUID;
BEGIN
  -- Hardcoded User ID
  target_user_id := 'd35238d5-05e9-4c41-abd5-b8cdc665f9bc';

  -- SELECT id INTO target_user_id FROM auth.users WHERE LOWER(email) = LOWER(TRIM(target_email));

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User % not found! Please Sign Up first in the app.', target_email;
  END IF;

  -- Insert or Update
  INSERT INTO public.admin_users (id, email, role)
  VALUES (target_user_id, target_email, 'super_admin')
  ON CONFLICT (id) DO UPDATE
  SET role = 'super_admin';
  
  RAISE NOTICE 'SUCCESS! Admin access granted to %', target_email;
END
$$;

COMMIT;
