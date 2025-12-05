import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { generateMetadata as genMeta } from "@/lib/utils/seo"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"

export const metadata = genMeta({
  title: "Contact Us",
  description:
    "Get in touch with Maa Santoshi Gramin Vikas Samiti. We'd love to hear from you about volunteering, partnerships, or any questions.",
})

async function getContactPageData() {
  const supabase = await createClient()

  const { data } = await supabase.from("page_content").select("content").eq("page_name", "contact").maybeSingle()

  return data?.content || {}
}

export default async function ContactPage() {
  const content = await getContactPageData()

  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-sm font-medium text-primary mb-2 block">Reach Out</span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">
                {content.title || "Get in Touch"}
              </h1>
              <p className="text-lg text-muted-foreground">
                {content.subtitle ||
                  "We'd love to hear from you. Reach out with any questions or to learn how you can get involved."}
              </p>
            </div>

            <div id="contact-form" className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto scroll-mt-32">
              <ContactForm />
              <ContactInfo
                email={content.email}
                phone={content.phone}
                address={content.address}
                hours={content.hours}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
