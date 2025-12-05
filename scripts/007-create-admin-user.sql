-- Script to create an admin user
-- First, you need to create a user in Supabase Auth, then run this script

-- Instructions:
-- 1. Go to your Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" and create a user with email/password
-- 3. Copy the user's UUID
-- 4. Replace 'YOUR_USER_UUID_HERE' below with the actual UUID
-- 5. Run this script

-- Example: If you created user vidhyachoure17@gmail.com, replace the UUID below

-- INSERT INTO admin_users (id, email, role)
-- VALUES ('d35238d5-05e9-4c41-abd5-b8cdc665f9bc', 'vidhyachoure17@gmail.com', 'super_admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'super_admin';

-- For testing, you can also use the Supabase Dashboard SQL Editor
-- Or run this after creating a user:

-- To find your user's UUID, run:
-- SELECT id, email FROM auth.users WHERE email = 'vidhyachoure17@gmail.com';

-- Then insert the admin user:
-- INSERT INTO admin_users (id, email, role)
-- SELECT id, email, 'super_admin' FROM auth.users WHERE email = 'vidhyachoure17@gmail.com'
-- ON CONFLICT (id) DO NOTHING;
