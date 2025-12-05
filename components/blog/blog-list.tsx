"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Clock, Eye, Grid3X3, List, Calendar, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import type { Blog } from "@/lib/types"

interface BlogListProps {
  blogs: Blog[]
  categories: string[]
  currentCategory?: string
}

const NGO_NAME = "Maa Santoshi Gramin Vikas Samiti"

export function BlogList({ blogs, categories, currentCategory }: BlogListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "views">("latest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [visibleCount, setVisibleCount] = useState(9)

  const filteredBlogs = useMemo(() => {
    let filtered = blogs

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchLower) ||
          blog.excerpt?.toLowerCase().includes(searchLower) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // Sort
    switch (sortBy) {
      case "popular":
        filtered = [...filtered].sort((a, b) => b.views - a.views)
        break
      case "views":
        filtered = [...filtered].sort((a, b) => b.views - a.views)
        break
      case "latest":
      default:
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(b.publish_date || b.created_at).getTime() - new Date(a.publish_date || a.created_at).getTime(),
        )
    }

    return filtered
  }, [blogs, search, sortBy])

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      router.push("/blogs")
    } else {
      router.push(`/blogs?category=${category}`)
    }
  }

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6)
  }

  const displayBlogs = filteredBlogs

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={currentCategory || "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  <span className="capitalize">{category}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: "latest" | "popular" | "views") => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden md:flex border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground mb-6">
        Showing {Math.min(visibleCount, displayBlogs.length)} of {displayBlogs.length} articles
      </p>

      {/* Blog Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayBlogs.slice(0, visibleCount).map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {displayBlogs.slice(0, visibleCount).map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <BlogListItem blog={blog} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load More */}
      {visibleCount < displayBlogs.length && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={loadMore} className="rounded-full bg-transparent">
            Load More Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Empty State */}
      {displayBlogs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No articles found matching your criteria.</p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() => {
              setSearch("")
              router.push("/blogs")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="block">
      <Card className="group h-full overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={blog.featured_image || `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(blog.title)}`}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {blog.category && <Badge className="absolute top-4 left-4 capitalize">{blog.category}</Badge>}
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(blog.publish_date || blog.created_at), "MMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {blog.reading_time} min
            </span>
          </div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{blog.author_name || NGO_NAME}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {blog.views} views
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function BlogListItem({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="block">
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-64 aspect-video md:aspect-[4/3] shrink-0 overflow-hidden">
            <Image
              src={
                blog.featured_image || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(blog.title)}`
              }
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <CardContent className="flex-1 p-5">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              {blog.category && (
                <Badge variant="secondary" className="capitalize">
                  {blog.category}
                </Badge>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(blog.publish_date || blog.created_at), "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {blog.reading_time} min read
              </span>
            </div>
            <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">{blog.title}</h3>
            <p className="text-muted-foreground line-clamp-2 mb-3">{blog.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>By {blog.author_name || NGO_NAME}</span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {blog.views} views
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
