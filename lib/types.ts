// Database Types for NGO Blogging Platform

export interface AdminUser {
  id: string
  email: string
  role: "super_admin" | "admin"
  display_name: string | null
  avatar_url: string | null
  last_login: string | null
  created_at: string
  updated_at: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image: string | null
  author_id: string | null
  author_name: string | null
  category: string | null
  tags: string[]
  views: number
  status: "draft" | "published" | "scheduled"
  publish_date: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[]
  reading_time: number
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  blog_id: string
  user_name: string
  user_email: string
  content: string
  parent_comment_id: string | null
  status: "pending" | "approved" | "rejected"
  likes: number
  created_at: string
}

export interface GalleryImage {
  id: string
  image_url: string
  title: string | null
  description: string | null
  category: string | null
  alt_text: string | null
  uploaded_by: string | null
  created_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  status: "pending" | "active" | "unsubscribed"
  confirmation_token: string | null
  subscribed_at: string
  confirmed_at: string | null
  unsubscribed_at: string | null
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  status: "unread" | "read" | "replied"
  created_at: string
}

export interface PageContent {
  id: string
  page_name: string
  content: Record<string, unknown>
  updated_by: string | null
  updated_at: string
}

export interface Analytics {
  id: string
  blog_id: string | null
  date: string
  views: number
  unique_visitors: number
  avg_time_on_page: number
  device_breakdown: {
    mobile: number
    desktop: number
    tablet: number
  }
  created_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: Record<string, unknown>
  updated_at: string
}

export interface ActivityLog {
  id: string
  user_id: string | null
  action: string
  resource_type: string | null
  resource_id: string | null
  details: Record<string, unknown>
  created_at: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  link: string | null
  created_at: string
}

// Helper types for page content
export interface HomePageContent {
  hero: {
    title: string
    subtitle: string
    cta_text: string
    cta_link: string
  }
  stats: Array<{
    label: string
    value: string
  }>
  mission: {
    title: string
    description: string
  }
}

export interface AboutPageContent {
  title: string
  history: string
  vision: string
  values: Array<{
    title: string
    description: string
  }>
  team: Array<{
    name: string
    role: string
    image: string
    bio: string
  }>
}

export interface ContactPageContent {
  title: string
  subtitle: string
  email: string
  phone: string
  address: string
  hours: string
}
