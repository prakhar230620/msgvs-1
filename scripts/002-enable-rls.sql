-- Enable Row Level Security on all tables

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Admin Users Policies
CREATE POLICY "Admin users can view all admin users" ON admin_users
  FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admin users can update their own profile" ON admin_users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admin can manage all admin users" ON admin_users
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE role = 'super_admin')
  );

-- Blogs Policies
CREATE POLICY "Anyone can view published blogs" ON blogs
  FOR SELECT USING (status = 'published' AND (publish_date IS NULL OR publish_date <= NOW()));

CREATE POLICY "Admins can view all blogs" ON blogs
  FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can create blogs" ON blogs
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can update blogs" ON blogs
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can delete blogs" ON blogs
  FOR DELETE USING (auth.uid() IN (SELECT id FROM admin_users));

-- Comments Policies
CREATE POLICY "Anyone can view approved comments" ON comments
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Anyone can create comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all comments" ON comments
  FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can update comments" ON comments
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can delete comments" ON comments
  FOR DELETE USING (auth.uid() IN (SELECT id FROM admin_users));

-- Gallery Policies
CREATE POLICY "Anyone can view gallery images" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage gallery" ON gallery
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

-- Newsletter Policies
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Subscribers can update their own subscription" ON newsletter_subscribers
  FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Admins can view all subscribers" ON newsletter_subscribers
  FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can manage subscribers" ON newsletter_subscribers
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

-- Contact Submissions Policies
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and manage contact submissions" ON contact_submissions
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

-- Page Content Policies
CREATE POLICY "Anyone can view page content" ON page_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage page content" ON page_content
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

-- Analytics Policies
CREATE POLICY "Admins can view analytics" ON analytics
  FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "System can insert analytics" ON analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update analytics" ON analytics
  FOR UPDATE USING (true);

-- Site Settings Policies
CREATE POLICY "Anyone can view site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON site_settings
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

-- Activity Logs Policies
CREATE POLICY "Admins can view activity logs" ON activity_logs
  FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can create activity logs" ON activity_logs
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));
