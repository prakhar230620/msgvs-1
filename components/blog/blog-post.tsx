"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Eye, Share2, Facebook, Twitter, Linkedin, Link2, ChevronUp, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { toast } from "sonner"
import type { Blog } from "@/lib/types"

const WhatsAppIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

interface BlogPostProps {
  blog: Blog
}

export function BlogPost({ blog }: BlogPostProps) {
  const [readProgress, setReadProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (articleRef.current) {
        const { top, height } = articleRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const scrolled = Math.max(0, -top)
        const total = height - windowHeight
        const progress = Math.min(100, (scrolled / total) * 100)
        setReadProgress(progress)
        setShowScrollTop(window.scrollY > 500)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const [content, setContent] = useState(blog.content)
  const [isLoadingContent, setIsLoadingContent] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      // Check if content is a GCS URL
      if (blog.content.startsWith("https://storage.googleapis.com")) {
        setIsLoadingContent(true)
        try {
          const response = await fetch(blog.content)
          if (!response.ok) throw new Error("Failed to fetch content")

          const compressedText = await response.text()
          // Dynamically import decompression to avoid server-side issues
          const { decompressText } = await import("@/lib/utils/compression")
          const decompressed = decompressText(compressedText)
          setContent(decompressed)
        } catch (error) {
          console.error("Error fetching blog content:", error)
          toast.error("Failed to load blog content")
        } finally {
          setIsLoadingContent(false)
        }
      } else {
        setContent(blog.content)
      }
    }

    fetchContent()
  }, [blog.content])

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareTitle = blog.title

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`,
      instagram: `https://www.instagram.com/`,
    }

    if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied to clipboard!")
      return
    }

    if (platform === "instagram") {
      navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied! Paste it on Instagram.")
      window.open(urls[platform], "_blank", "width=600,height=400")
      return
    }

    window.open(urls[platform], "_blank", "width=600,height=400")
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
        <motion.div className="h-full bg-primary" style={{ width: `${readProgress}%` }} />
      </div>

      <article ref={articleRef} className="pb-16">
        {/* Hero Section */}
        <div className="relative">
          {blog.featured_image && (
            <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] w-full">
              <Image
                src={blog.featured_image || "/placeholder.svg"}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>
          )}

          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto -mt-32 relative z-10">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <span>/</span>
                <Link href="/blogs" className="hover:text-foreground transition-colors">
                  Blog
                </Link>
                <span>/</span>
                <span className="text-foreground truncate max-w-[200px]">{blog.title}</span>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-background rounded-2xl p-6 md:p-8 shadow-lg"
              >
                {blog.category && <Badge className="mb-4 capitalize">{blog.category}</Badge>}

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-6 text-balance">
                  {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{blog.author_name || "MSGVS Team"}</p>
                      <p className="text-xs">Author</p>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(blog.publish_date || blog.created_at), "MMMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {blog.reading_time} min read
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {blog.views.toLocaleString()} views
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Share:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                        <WhatsAppIcon />
                        <span className="ml-2">WhatsApp</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("facebook")}>
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("twitter")}>
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("instagram")}>
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.645.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        Instagram
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("copy")}>
                        <Link2 className="h-4 w-4 mr-2" />
                        Copy Link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 mt-12">
          <div className="max-w-3xl mx-auto">
            {isLoadingContent ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="prose prose-lg max-w-none
                  prose-headings:font-serif prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl
                  prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                  prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                "
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h4 className="text-sm font-medium mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Link key={tag} href={`/blogs?tag=${tag}`}>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <Button size="icon" className="rounded-full shadow-lg" onClick={scrollToTop}>
            <ChevronUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </>
  )
}
