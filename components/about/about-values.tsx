"use client"

import { motion } from "framer-motion"
import { Shield, Heart, Users, Target } from "lucide-react"

interface Value {
  title: string
  description: string
}

interface AboutValuesProps {
  values?: Value[]
}

const defaultValues = [
  {
    title: "Integrity",
    description: "We operate with complete transparency and accountability in everything we do.",
    icon: Shield,
  },
  {
    title: "Compassion",
    description: "Every action we take is driven by empathy and genuine care for those we serve.",
    icon: Heart,
  },
  {
    title: "Collaboration",
    description: "We believe in the power of working together with communities and partners.",
    icon: Users,
  },
  {
    title: "Impact",
    description: "We focus on creating measurable, sustainable change in the communities we serve.",
    icon: Target,
  },
]

export function AboutValues({ values }: AboutValuesProps) {
  const displayValues = values?.length
    ? values.map((v, i) => ({ ...v, icon: defaultValues[i]?.icon || Shield }))
    : defaultValues

  return (
    <section id="mission" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary mb-2 block">What We Stand For</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Our Core Values</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayValues.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl p-6 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <value.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
              <p className="text-muted-foreground text-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
