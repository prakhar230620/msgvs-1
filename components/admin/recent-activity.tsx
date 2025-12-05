"use client"

import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import Link from "next/link"

interface Blog {
  id: string
  title: string
  status: string
  views: number
  created_at: string
}

interface RecentActivityProps {
  blogs: Blog[]
}

export function RecentActivity({ blogs }: RecentActivityProps) {
  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileText className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">No blog posts yet</p>
        <Link href="/admin/blogs/new" className="mt-2 text-sm text-primary hover:underline">
          Create your first post
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <Link
          key={blog.id}
          href={`/admin/blogs/${blog.id}`}
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{blog.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={blog.status === "published" ? "default" : "secondary"} className="text-xs capitalize">
                {blog.status}
              </Badge>
              <span className="text-xs text-muted-foreground">{blog.views} views</span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}
          </span>
        </Link>
      ))}
    </div>
  )
}
