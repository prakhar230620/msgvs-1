import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { BlogEditor } from "@/components/admin/blog-editor"

interface EditBlogPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: blog, error } = await supabase.from("blogs").select("*").eq("id", id).single()

  if (error || !blog) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground">Update your blog post content and settings.</p>
      </div>
      <BlogEditor blog={blog} />
    </div>
  )
}
