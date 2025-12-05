import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { generateMetadata as genMeta } from "@/lib/utils/seo"
import { BlogList } from "@/components/blog/blog-list"

export const metadata = genMeta({
  title: "Blog",
  description: "Read stories of impact, news, and updates from Hope Foundation's work in communities worldwide.",
})

interface BlogsPageProps {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>
}

async function getBlogs(category?: string, tag?: string) {
  const supabase = await createClient()

  let query = supabase.from("blogs").select("*").eq("status", "published").order("publish_date", { ascending: false })

  if (category) {
    query = query.eq("category", category)
  }

  if (tag) {
    query = query.contains("tags", [tag])
  }

  const { data } = await query

  return data || []
}

async function getCategories() {
  const supabase = await createClient()

  const { data } = await supabase.from("blogs").select("category").eq("status", "published").not("category", "is", null)

  const categories = [...new Set(data?.map((b) => b.category).filter(Boolean))]
  return categories as string[]
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams
  const [blogs, categories] = await Promise.all([getBlogs(params.category, params.tag), getCategories()])

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-sm font-medium text-primary mb-2 block">Our Stories</span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">Blog & News</h1>
              <p className="text-lg text-muted-foreground">
                Discover stories of impact, program updates, and insights from our work around the world.
              </p>
            </div>

            <BlogList blogs={blogs} categories={categories} currentCategory={params.category} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
