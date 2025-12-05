"use client"

import { motion } from "framer-motion"

export const defaultMilestones = [
  {
    year: "2009",
    title: "Foundation Established",
    description: "Started with a small team of passionate individuals determined to make a difference.",
  },
  {
    year: "2012",
    title: "First Major Program",
    description: "Launched our flagship education initiative, reaching 1,000 children in rural areas.",
  },
  {
    year: "2015",
    title: "Healthcare Expansion",
    description: "Opened our first community health center, providing free medical care to thousands.",
  },
  {
    year: "2018",
    title: "International Recognition",
    description: "Received the Global Impact Award for our sustainable development programs.",
  },
  {
    year: "2021",
    title: "Digital Transformation",
    description: "Launched online learning platforms, reaching students in remote locations.",
  },
  {
    year: "2024",
    title: "50,000 Lives Impacted",
    description: "Achieved our milestone of positively impacting 50,000 lives across 150 communities.",
  },
]

interface Milestone {
  year: string
  title: string
  description: string
}

interface AboutTimelineProps {
  milestones?: Milestone[]
}

export function AboutTimeline({ milestones = defaultMilestones }: AboutTimelineProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary mb-2 block">Our Journey</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Milestones of Impact</h2>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-start gap-6 mb-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
            >
              {/* Dot */}
              <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1.5 md:-translate-x-1.5 mt-1.5" />

              {/* Content */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                <span className="inline-block px-3 py-1 text-sm font-semibold bg-primary/10 text-primary rounded-full mb-2">
                  {milestone.year}
                </span>
                <h3 className="font-semibold text-lg mb-1">{milestone.title}</h3>
                <p className="text-muted-foreground text-sm">{milestone.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
