import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { generateMetadata as genMeta } from "@/lib/utils/seo"
import { AboutHero } from "@/components/about/about-hero"
import { AboutValues } from "@/components/about/about-values"
import { AboutTimeline } from "@/components/about/about-timeline"
import { AboutTeam } from "@/components/about/about-team"
import { CTASection } from "@/components/sections/cta-section"

export const metadata = genMeta({
  title: "About Us",
  description:
    "Learn about Hope Foundation's mission, vision, and the dedicated team working to create lasting change in communities worldwide.",
})

async function getAboutPageData() {
  const supabase = await createClient()

  const { data } = await supabase.from("page_content").select("content").eq("page_name", "about").single()

  return data?.content || {}
}

export default async function AboutPage() {
  const content = await getAboutPageData()

  return (
    <>
      <Header />
      <main className="pt-20">
        <AboutHero
          title={content.title}
          history={content.history}
          vision={content.vision}
          image={content.image}
          statsCount={content.statsCount}
          statsLabel={content.statsLabel}
        />
        <AboutValues values={content.values} />
        <AboutTimeline milestones={content.timeline} />
        <AboutTeam team={content.team} />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
