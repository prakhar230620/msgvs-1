"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { format } from "date-fns"

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  reading_time: number
  publish_date: string | null
  created_at: string
}

interface RelatedPostsProps {
  posts: RelatedPost[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">Related Articles</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blogs/${post.slug}`} className="block h-full">
                  <Card className="group h-full overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={
                          post.featured_image ||
                          `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(post.title) || "/placeholder.svg"}`
                        }
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>{format(new Date(post.publish_date || post.created_at), "MMM d, yyyy")}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.reading_time} min
                        </span>
                      </div>
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
