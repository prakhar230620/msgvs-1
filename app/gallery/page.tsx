import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { generateMetadata as genMeta } from "@/lib/utils/seo"
import { GalleryGrid } from "@/components/gallery/gallery-grid"

export const metadata = genMeta({
  title: "Gallery",
  description: "Browse photos and images from Hope Foundation's programs, events, and community impact.",
})

async function getGalleryImages() {
  const supabase = await createClient()

  const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false })

  return data || []
}

export default async function GalleryPage() {
  const images = await getGalleryImages()

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-sm font-medium text-primary mb-2 block">Visual Stories</span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">Our Gallery</h1>
              <p className="text-lg text-muted-foreground">
                A glimpse into the communities we serve and the impact we create together.
              </p>
            </div>

            <GalleryGrid images={images} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
