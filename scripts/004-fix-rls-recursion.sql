-- Fix infinite recursion in admin_users RLS policies
-- The issue is that policies on admin_users reference admin_users itself

-- First, drop all existing policies on admin_users
DROP POLICY IF EXISTS "Admin users can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can update their own profile" ON admin_users;
DROP POLICY IF EXISTS "Super admin can manage all admin users" ON admin_users;

-- Create a security definer function to check if user is admin
-- This function bypasses RLS to avoid recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate admin_users policies using the helper functions
CREATE POLICY "Admin users can view all admin users" ON admin_users
  FOR SELECT USING (is_admin());

CREATE POLICY "Admin users can update their own profile" ON admin_users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admin can manage all admin users" ON admin_users
  FOR ALL USING (is_super_admin());

-- Now update all other tables to use the helper function instead of subqueries
-- Drop and recreate blog policies
DROP POLICY IF EXISTS "Admins can view all blogs" ON blogs;
DROP POLICY IF EXISTS "Admins can create blogs" ON blogs;
DROP POLICY IF EXISTS "Admins can update blogs" ON blogs;
DROP POLICY IF EXISTS "Admins can delete blogs" ON blogs;

CREATE POLICY "Admins can view all blogs" ON blogs
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can create blogs" ON blogs
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update blogs" ON blogs
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete blogs" ON blogs
  FOR DELETE USING (is_admin());

-- Drop and recreate comment policies
DROP POLICY IF EXISTS "Admins can view all comments" ON comments;
DROP POLICY IF EXISTS "Admins can update comments" ON comments;
DROP POLICY IF EXISTS "Admins can delete comments" ON comments;

CREATE POLICY "Admins can view all comments" ON comments
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update comments" ON comments
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete comments" ON comments
  FOR DELETE USING (is_admin());

-- Drop and recreate gallery policies
DROP POLICY IF EXISTS "Admins can manage gallery" ON gallery;

CREATE POLICY "Admins can manage gallery" ON gallery
  FOR ALL USING (is_admin());

-- Drop and recreate newsletter policies
DROP POLICY IF EXISTS "Admins can view all subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can manage subscribers" ON newsletter_subscribers;

CREATE POLICY "Admins can view all subscribers" ON newsletter_subscribers
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage subscribers" ON newsletter_subscribers
  FOR ALL USING (is_admin());

-- Drop and recreate contact submissions policies
DROP POLICY IF EXISTS "Admins can view and manage contact submissions" ON contact_submissions;

CREATE POLICY "Admins can view and manage contact submissions" ON contact_submissions
  FOR ALL USING (is_admin());

-- Drop and recreate page content policies
DROP POLICY IF EXISTS "Admins can manage page content" ON page_content;

CREATE POLICY "Admins can manage page content" ON page_content
  FOR ALL USING (is_admin());

-- Drop and recreate analytics policies
DROP POLICY IF EXISTS "Admins can view analytics" ON analytics;

CREATE POLICY "Admins can view analytics" ON analytics
  FOR SELECT USING (is_admin());

-- Drop and recreate site settings policies
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;

CREATE POLICY "Admins can manage site settings" ON site_settings
  FOR ALL USING (is_admin());

-- Drop and recreate activity logs policies
DROP POLICY IF EXISTS "Admins can view activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Admins can create activity logs" ON activity_logs;

CREATE POLICY "Admins can view activity logs" ON activity_logs
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can create activity logs" ON activity_logs
  FOR INSERT WITH CHECK (is_admin());
