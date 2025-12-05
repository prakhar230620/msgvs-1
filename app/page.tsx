import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { StatsSection } from "@/components/sections/stats-section"
import { FeaturedBlogs } from "@/components/sections/featured-blogs"
import { MissionSection } from "@/components/sections/mission-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CTASection } from "@/components/sections/cta-section"

async function getHomePageData() {
  const supabase = await createClient()

  const [pageContentResult, blogsResult] = await Promise.all([
    supabase.from("page_content").select("content").eq("page_name", "home").single(),
    supabase.from("blogs").select("*").eq("status", "published").order("publish_date", { ascending: false }).limit(6),
  ])

  return {
    pageContent: pageContentResult.data?.content || {},
    blogs: blogsResult.data || [],
  }
}

export default async function HomePage() {
  const { pageContent, blogs } = await getHomePageData()

  const hero = pageContent.hero || {}
  const stats = pageContent.stats || []
  const mission = pageContent.mission || {}

  return (
    <>
      <Header />
      <main>
        <HeroSection
          title={hero.title}
          subtitle={hero.subtitle}
          ctaText={hero.ctaText}
          ctaLink={hero.ctaLink}
          backgroundImage={hero.backgroundImage}
        />
        <StatsSection stats={stats} />
        <MissionSection title={mission.title} description={mission.description} />
        <FeaturedBlogs blogs={blogs} />
        <TestimonialsSection testimonials={pageContent.testimonials} />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
