"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

interface Post {
  id: string
  title: string
  slug: string
  views: number
  created_at: string
}

interface TopPostsProps {
  posts: Post[]
}

export function TopPosts({ posts }: TopPostsProps) {
  const totalViews = posts.reduce((acc, post) => acc + post.views, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Posts</CardTitle>
        <CardDescription>Posts ranked by total views</CardDescription>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No published posts yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Post Title</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post, index) => {
                const share = totalViews > 0 ? ((post.views / totalViews) * 100).toFixed(1) : "0"
                const isTop3 = index < 3

                return (
                  <TableRow key={post.id}>
                    <TableCell>
                      {isTop3 ? (
                        <Badge variant={index === 0 ? "default" : "secondary"}>{index + 1}</Badge>
                      ) : (
                        <span className="text-muted-foreground">{index + 1}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/blogs/${post.id}`} className="font-medium hover:underline">
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="flex items-center justify-end gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        {post.views.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{share}%</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
