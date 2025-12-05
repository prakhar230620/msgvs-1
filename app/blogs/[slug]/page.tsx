import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BlogPost } from "@/components/blog/blog-post"
import { RelatedPosts } from "@/components/blog/related-posts"
import { generateMetadata as genMeta, generateArticleSchema, generateBreadcrumbSchema } from "@/lib/utils/seo"
import type { Metadata } from "next"

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false

  if (user) {
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    if (adminUser) isAdmin = true
  }

  let query = supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)

  if (!isAdmin) {
    query = query.eq("status", "published")
  }

  const { data: blog } = await query.maybeSingle()

  if (!blog) {
    return { title: "Blog Not Found" }
  }

  return genMeta({
    title: blog.seo_title || blog.title,
    description: blog.seo_description || blog.excerpt || "",
    keywords: blog.seo_keywords,
    image: blog.featured_image || undefined,
    type: "article",
    publishedTime: blog.publish_date || blog.created_at,
    modifiedTime: blog.updated_at,
    author: blog.author_name || "Maa Santoshi Gramin Vikas Samiti",
    url: `/blogs/${slug}`,
  })
}

async function getBlog(slug: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false

  if (user) {
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    if (adminUser) isAdmin = true
  }

  let query = supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)

  // Only filter by published if not admin
  if (!isAdmin) {
    query = query.eq("status", "published")
  }

  const { data: blog, error } = await query.maybeSingle()

  if (error || !blog) {
    return null
  }

  // Increment view count only for public views
  if (!isAdmin) {
    await supabase.rpc("increment_blog_views", { blog_id: blog.id })
  }

  return blog
}

async function getRelatedPosts(blogId: string, category: string | null, tags: string[]) {
  const supabase = await createClient()

  let query = supabase
    .from("blogs")
    .select("id, title, slug, excerpt, featured_image, reading_time, publish_date, created_at")
    .eq("status", "published")
    .neq("id", blogId)
    .limit(3)

  if (category) {
    query = query.eq("category", category)
  }

  const { data } = await query

  return data || []
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(blog.id, blog.category, blog.tags)

  const articleSchema = generateArticleSchema({
    title: blog.title,
    description: blog.excerpt || "",
    image: blog.featured_image || undefined,
    author: blog.author_name || "Maa Santoshi Gramin Vikas Samiti",
    publishedTime: blog.publish_date || blog.created_at,
    modifiedTime: blog.updated_at,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/blogs/${slug}`,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: process.env.NEXT_PUBLIC_SITE_URL || "" },
    { name: "Blog", url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/blogs` },
    { name: blog.title, url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/blogs/${slug}` },
  ])

  return (
    <>
      <Header />
      <main className="pt-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <BlogPost blog={blog} />
        {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
      </main>
      <Footer />
    </>
  )
}
