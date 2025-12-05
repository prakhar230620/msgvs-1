import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { BlogsTable } from "@/components/admin/blogs-table"

async function getBlogs() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blogs:", error)
    return []
  }

  return data || []
}

export default async function BlogsPage() {
  const blogs = await getBlogs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">Create, edit, and manage your blog posts.</p>
        </div>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>
            {blogs.length} {blogs.length === 1 ? "post" : "posts"} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlogsTable blogs={blogs} />
        </CardContent>
      </Card>
    </div>
  )
}
