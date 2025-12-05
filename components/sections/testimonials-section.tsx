"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Testimonial {
  quote: string
  author: string
  role: string
  location: string
  image: string
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
}

export const defaultTestimonials = [
  {
    quote:
      "The education program transformed our village. Children who once had no access to learning now dream of becoming doctors and engineers.",
    author: "Maria Santos",
    role: "Community Leader",
    location: "Philippines",
    image: "/professional-woman-portrait.png",
  },
  {
    quote:
      "Thanks to the healthcare initiative, our community has seen a significant decrease in preventable diseases. The impact has been life-changing.",
    author: "James Okonkwo",
    role: "Local Health Worker",
    location: "Nigeria",
    image: "/professional-man-portrait.png",
  },
  {
    quote:
      "The microfinance program gave me the opportunity to start my own business. Now I can support my family and send my children to school.",
    author: "Priya Sharma",
    role: "Small Business Owner",
    location: "India",
    image: "/woman-portrait-entrepreneur.jpg",
  },
]

export function TestimonialsSection({ testimonials = defaultTestimonials }: TestimonialsSectionProps) {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

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
          <span className="text-sm font-medium text-primary mb-2 block">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Voices of Change</h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-muted/30 rounded-3xl p-8 md:p-12"
              >
                <Quote className="h-10 w-10 text-primary/20 mb-6" />
                <blockquote className="text-xl md:text-2xl font-serif text-foreground mb-8 leading-relaxed">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonials[current].image || "/placeholder.svg"}
                    alt={testimonials[current].author}
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonials[current].author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[current].role}, {testimonials[current].location}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-4 mt-8">
              <Button variant="outline" size="icon" className="rounded-full bg-transparent" onClick={prev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${index === current ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                  />
                ))}
              </div>
              <Button variant="outline" size="icon" className="rounded-full bg-transparent" onClick={next}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
