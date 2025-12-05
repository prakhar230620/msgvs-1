import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // Get the blog post
    const { data: blog } = await supabase.from("blogs").select("id, views").eq("slug", slug).single()

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Increment view count
    const { error } = await supabase
      .from("blogs")
      .update({ views: (blog.views || 0) + 1 })
      .eq("id", blog.id)

    if (error) {
      console.error("View increment error:", error)
      return NextResponse.json({ error: "Failed to update views" }, { status: 500 })
    }

    return NextResponse.json({ views: (blog.views || 0) + 1 })
  } catch (error) {
    console.error("View API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
