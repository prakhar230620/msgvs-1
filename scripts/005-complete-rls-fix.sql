-- COMPLETE FIX FOR RLS INFINITE RECURSION
-- This script completely removes and recreates all RLS policies
-- using auth.uid() directly instead of subqueries to admin_users

-- Step 1: Drop ALL existing policies to start fresh
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    -- Drop all policies on all tables
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- Step 2: Drop existing helper functions
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS is_super_admin() CASCADE;
DROP FUNCTION IF EXISTS get_user_role() CASCADE;

-- Step 3: Create a secure function to check admin status
-- This function uses SECURITY DEFINER to bypass RLS when checking
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM admin_users
    WHERE id = auth.uid();
    
    RETURN COALESCE(user_role, 'none');
END;
$$;

-- Helper function to check if current user is any admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN get_user_role() IN ('admin', 'super_admin');
END;
$$;

-- Helper function to check if current user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN get_user_role() = 'super_admin';
END;
$$;

-- Step 4: Enable RLS on all tables
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Step 5: ADMIN_USERS policies (CRITICAL - no self-referencing)
-- For admin_users, we simply allow authenticated users to read their own row
-- and use the SECURITY DEFINER functions for other checks

CREATE POLICY "admin_users_select_own"
ON admin_users FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "admin_users_super_admin_all"
ON admin_users FOR ALL
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- Step 6: BLOGS policies
CREATE POLICY "blogs_public_read"
ON blogs FOR SELECT
TO anon, authenticated
USING (status = 'published');

CREATE POLICY "blogs_admin_all"
ON blogs FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Step 7: COMMENTS policies
CREATE POLICY "comments_public_read_approved"
ON comments FOR SELECT
TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "comments_public_insert"
ON comments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "comments_admin_all"
ON comments FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Step 8: GALLERY policies
CREATE POLICY "gallery_public_read"
ON gallery FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "gallery_admin_all"
ON gallery FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Step 9: NEWSLETTER_SUBSCRIBERS policies
CREATE POLICY "newsletter_public_insert"
ON newsletter_subscribers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "newsletter_admin_all"
ON newsletter_subscribers FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Step 10: CONTACT_SUBMISSIONS policies
CREATE POLICY "contact_public_insert"
ON contact_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "contact_admin_all"
ON contact_submissions FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Step 11: PAGE_CONTENT policies
CREATE POLICY "page_content_public_read"
ON page_content FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "page_content_admin_all"
ON page_content FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Step 12: ANALYTICS policies
CREATE POLICY "analytics_admin_only"
ON analytics FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Step 13: SITE_SETTINGS policies
CREATE POLICY "site_settings_public_read"
ON site_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "site_settings_admin_all"
ON site_settings FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Step 14: ACTIVITY_LOGS policies
CREATE POLICY "activity_logs_admin_read"
ON activity_logs FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "activity_logs_admin_insert"
ON activity_logs FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Grant execute permissions on helper functions
GRANT EXECUTE ON FUNCTION get_user_role() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin() TO anon, authenticated;
