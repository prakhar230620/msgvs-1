-- Seed initial page content
INSERT INTO page_content (page_name, content) VALUES 
('home', '{
  "hero": {
    "title": "Empowering Communities, Transforming Lives",
    "subtitle": "We work tirelessly to create sustainable change in communities across the globe through education, healthcare, and economic empowerment.",
    "cta_text": "Learn More",
    "cta_link": "/about"
  },
  "stats": [
    {"label": "Communities Served", "value": "150+"},
    {"label": "Lives Impacted", "value": "50,000+"},
    {"label": "Active Volunteers", "value": "500+"},
    {"label": "Years of Service", "value": "15+"}
  ],
  "mission": {
    "title": "Our Mission",
    "description": "To empower underserved communities through sustainable programs that promote education, health, and economic independence."
  }
}'::jsonb),
('about', '{
  "title": "About Our Organization",
  "history": "Founded in 2009, our organization began with a simple mission: to make a lasting difference in the lives of those who need it most.",
  "vision": "A world where every community has access to education, healthcare, and opportunities for economic growth.",
  "values": [
    {"title": "Integrity", "description": "We operate with complete transparency and accountability."},
    {"title": "Compassion", "description": "Every action we take is driven by empathy and care."},
    {"title": "Sustainability", "description": "We build programs that create lasting change."},
    {"title": "Collaboration", "description": "We believe in the power of working together."}
  ],
  "team": []
}'::jsonb),
('contact', '{
  "title": "Get in Touch",
  "subtitle": "We would love to hear from you. Reach out to us with any questions or to learn how you can get involved.",
  "email": "contact@ngo-example.org",
  "phone": "+1 (555) 123-4567",
  "address": "123 Hope Street, New York, NY 10001",
  "hours": "Monday - Friday: 9:00 AM - 5:00 PM"
}'::jsonb)
ON CONFLICT (page_name) DO NOTHING;

-- Seed initial site settings
INSERT INTO site_settings (key, value) VALUES 
('general', '{
  "site_name": "Hope Foundation",
  "tagline": "Empowering Communities, Transforming Lives",
  "logo_url": "",
  "favicon_url": ""
}'::jsonb),
('seo', '{
  "default_title": "Hope Foundation - Empowering Communities",
  "default_description": "We work to create sustainable change through education, healthcare, and economic empowerment.",
  "default_keywords": ["NGO", "charity", "community", "education", "healthcare"]
}'::jsonb),
('social', '{
  "facebook": "",
  "twitter": "",
  "instagram": "",
  "linkedin": "",
  "youtube": ""
}'::jsonb)
ON CONFLICT (key) DO NOTHING;
