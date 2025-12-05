"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Linkedin, Twitter } from "lucide-react"

interface TeamMember {
  name: string
  role: string
  image: string
  bio?: string
}

interface AboutTeamProps {
  team?: TeamMember[]
}

export const defaultTeam: TeamMember[] = [
  {
    name: "Sarah Johnson",
    role: "Executive Director",
    image: "/professional-woman-executive.png",
    bio: "20+ years of experience in nonprofit leadership and community development.",
  },
  {
    name: "Michael Chen",
    role: "Programs Director",
    image: "/professional-asian-man.png",
    bio: "Expert in designing sustainable community development programs.",
  },
  {
    name: "Amara Obi",
    role: "Operations Manager",
    image: "/professional-woman-african.jpg",
    bio: "Ensures smooth day-to-day operations across all our programs.",
  },
  {
    name: "David Martinez",
    role: "Community Outreach",
    image: "/professional-latino-man.png",
    bio: "Builds strong relationships with communities and partners.",
  },
]

export function AboutTeam({ team }: AboutTeamProps) {
  const displayTeam = team?.length ? team : defaultTeam

  return (
    <section id="team" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary mb-2 block">The People Behind Our Mission</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Our Leadership Team</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTeam.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl overflow-hidden group"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                {member.bio && <p className="text-muted-foreground text-sm">{member.bio}</p>}
                <div className="flex gap-3 mt-4">
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${member.name} on Twitter`}
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
