"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface AboutHeroProps {
  title?: string
  history?: string
  vision?: string
  image?: string
  statsCount?: string
  statsLabel?: string
}

export function AboutHero({
  title = "About Our Organization",
  history = "Founded in 2009, our organization began with a simple mission: to make a lasting difference in the lives of those who need it most.",
  vision = "A world where every community has access to education, healthcare, and opportunities for economic growth.",
  image = "/diverse-team-volunteers-community-work.jpg",
  statsCount = "15+",
  statsLabel = "Years of Service"
}: AboutHeroProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-sm font-medium text-primary mb-4 block">Our Story</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-6">{title}</h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{history}</p>
            <div className="bg-primary/5 rounded-2xl p-6">
              <h3 className="font-semibold mb-2">Our Vision</h3>
              <p className="text-muted-foreground">{vision}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={image} alt="Our team at work" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background rounded-2xl p-6 shadow-lg max-w-[200px]">
              <div className="text-3xl font-bold text-primary mb-1">{statsCount}</div>
              <div className="text-sm text-muted-foreground">{statsLabel}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
