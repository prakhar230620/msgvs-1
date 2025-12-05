"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Eye } from "lucide-react"
import type { Blog } from "@/lib/types"

interface FeaturedBlogsProps {
  blogs: Blog[]
}

export function FeaturedBlogs({ blogs }: FeaturedBlogsProps) {
  if (blogs.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-sm font-medium text-primary mb-2 block">Latest Updates</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Stories of Impact</h2>
          </div>
          <Button variant="outline" asChild className="rounded-full self-start bg-transparent">
            <Link href="/blogs">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.slice(0, 6).map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blogs/${blog.slug}`}>
                <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={
                        blog.featured_image ||
                        `/placeholder.jpg`
                      }
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {blog.category && <Badge className="absolute top-4 left-4 capitalize">{blog.category}</Badge>}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {blog.reading_time} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {blog.views} views
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
