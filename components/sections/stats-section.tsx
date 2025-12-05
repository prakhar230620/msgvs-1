"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useCountUp } from "@/hooks/use-count-up"

interface Stat {
  label: string
  value: string
}

interface StatsSectionProps {
  stats?: Stat[]
}

const defaultStats = [
  { label: "Communities Served", value: "150+" },
  { label: "Lives Impacted", value: "50,000+" },
  { label: "Active Volunteers", value: "500+" },
  { label: "Years of Service", value: "15+" },
]

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Parse the number from the value string
  const numericValue = Number.parseInt(stat.value.replace(/[^0-9]/g, "")) || 0
  const suffix = stat.value.replace(/[0-9]/g, "")

  const count = useCountUp(isInView ? numericValue : 0, 2000)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center p-6"
    >
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-muted-foreground font-medium">{stat.label}</div>
    </motion.div>
  )
}

export function StatsSection({ stats = defaultStats }: StatsSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
