import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blogId, name, email, content, parentId } = body

    if (!blogId || !name || !email || !content) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("comments")
      .insert({
        blog_id: blogId,
        author_name: name,
        author_email: email,
        content,
        parent_id: parentId || null,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Comment submission error:", error)
      return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 })
    }

    return NextResponse.json({ success: true, comment: data })
  } catch (error) {
    console.error("Comments API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blogId = searchParams.get("blogId")

    if (!blogId) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: comments, error } = await supabase
      .from("comments")
      .select("*")
      .eq("blog_id", blogId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Comments fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
    }

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Comments API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
