"use client"

import { motion } from "framer-motion"
import { Heart, Users, Globe, Sparkles } from "lucide-react"

interface MissionSectionProps {
  title?: string
  description?: string
}

const features = [
  {
    icon: Heart,
    title: "Compassion",
    description: "Every action we take is driven by empathy and genuine care for those we serve.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We believe in the power of communities working together to create lasting change.",
  },
  {
    icon: Globe,
    title: "Sustainability",
    description: "Our programs are designed to create self-sustaining impact that lasts for generations.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "We continuously seek new and effective ways to address community challenges.",
  },
]

export function MissionSection({
  title = "Our Mission",
  description = "To empower underserved communities through sustainable programs that promote education, health, and economic independence.",
}: MissionSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-medium text-primary mb-2 block">What Drives Us</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground text-pretty">{description}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
