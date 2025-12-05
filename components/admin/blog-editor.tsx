"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { ImageUploader } from "@/components/admin/image-uploader"
import { generateSlug, calculateReadingTime } from "@/lib/utils/compression"
import { Save, Eye, Send, Loader2, X, Plus, Clock, FileText } from "lucide-react"
import type { Blog } from "@/lib/types"
import { toast } from "sonner"

const CATEGORIES = ["News", "Stories", "Impact", "Events", "Education", "Healthcare", "Community", "Volunteer", "Other"]

interface BlogEditorProps {
  blog?: Blog
}

export function BlogEditor({ blog }: BlogEditorProps) {
  const router = useRouter()
  const isEditing = !!blog

  const [title, setTitle] = useState(blog?.title || "")
  const [slug, setSlug] = useState(blog?.slug || "")
  const [content, setContent] = useState(blog?.content || "")
  const [excerpt, setExcerpt] = useState(blog?.excerpt || "")
  const [featuredImage, setFeaturedImage] = useState(blog?.featured_image || "")
  const [category, setCategory] = useState(blog?.category || "")
  const [tags, setTags] = useState<string[]>(blog?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">(blog?.status || "draft")
  const [seoTitle, setSeoTitle] = useState(blog?.seo_title || "")
  const [seoDescription, setSeoDescription] = useState(blog?.seo_description || "")
  const [seoKeywords, setSeoKeywords] = useState<string[]>(blog?.seo_keywords || [])

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && title) {
      setSlug(generateSlug(title))
    }
  }, [title, isEditing])

  // Auto-generate excerpt from content
  useEffect(() => {
    if (!excerpt && content) {
      const plainText = content.replace(/<[^>]*>/g, "").trim()
      if (plainText.length > 160) {
        setExcerpt(plainText.substring(0, 157) + "...")
      } else {
        setExcerpt(plainText)
      }
    }
  }, [content, excerpt])

  const readingTime = calculateReadingTime(content.replace(/<[^>]*>/g, ""))

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSave = useCallback(
    async (publishStatus?: "draft" | "published", shouldRedirect: boolean = true) => {
      if (!title.trim()) {
        toast.error("Please enter a title")
        return null
      }

      setIsSaving(true)
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      const blogData = {
        title,
        slug,
        content,
        excerpt,
        featured_image: featuredImage,
        category,
        tags,
        status: publishStatus || status,
        seo_title: seoTitle || title,
        seo_description: seoDescription || excerpt,
        seo_keywords: seoKeywords,
        reading_time: readingTime,
        author_id: user?.id,
        publish_date: publishStatus === "published" ? new Date().toISOString() : blog?.publish_date,
        updated_at: new Date().toISOString(),
      }

      let error
      let result

      if (isEditing) {
        result = await supabase.from("blogs").update(blogData).eq("id", blog.id)
        error = result.error
      } else {
        result = await supabase.from("blogs").insert(blogData).select()
        error = result.error
      }

      if (error) {
        toast.error("Failed to save: " + error.message)
        setIsSaving(false)
        return null
      } else {
        setLastSaved(new Date())
        toast.success(publishStatus === "published" ? "Post published successfully!" : "Post saved successfully!")

        const savedId = isEditing ? blog.id : result.data?.[0]?.id

        // Trigger email notification if published
        if (publishStatus === "published" && (status !== "published" || !isEditing)) {
          try {
            fetch("/api/newsletter/notify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                blogId: savedId,
                title,
                slug,
                excerpt
              })
            })
          } catch (e) {
            console.error("Failed to trigger notification", e)
          }
        }

        if (shouldRedirect) {
          if (!isEditing) {
            router.push("/admin/blogs")
          } else {
            router.refresh()
          }
        } else if (!isEditing && savedId) {
          // If we are not redirecting to list (e.g. preview), we must switch to edit mode
          // to prevent duplicate creations on next save.
          router.replace(`/admin/blogs/${savedId}`)
        } else {
          router.refresh()
        }

        setIsSaving(false)
        return savedId
      }
    },
    [
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      category,
      tags,
      status,
      seoTitle,
      seoDescription,
      seoKeywords,
      readingTime,
      isEditing,
      blog,
      router,
    ],
  )

  const handlePreview = async () => {
    // Save as draft first (without redirecting to list)
    const id = await handleSave("draft", false)
    if (id) {
      window.open(`/blogs/${slug}`, "_blank")
    }
  }

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!isEditing || status !== "draft") return

    const interval = setInterval(() => {
      if (title.trim()) {
        handleSave()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [handleSave, isEditing, status, title])

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Editor */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/blogs/</span>
                  <Input id="slug" placeholder="url-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor content={content} onChange={setContent} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Excerpt</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Brief summary of the post..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground mt-2">{excerpt.length}/160 characters recommended</p>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Publish Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Publish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={status === "published" ? "default" : "secondary"} className="capitalize">
                {status}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Reading time:
              </span>
              <span>{readingTime} min read</span>
            </div>
            {lastSaved && <p className="text-xs text-muted-foreground">Last saved: {lastSaved.toLocaleTimeString()}</p>}
            <Separator />
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={() => handleSave("draft")} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Draft
              </Button>
              <Button variant="outline" onClick={handlePreview} disabled={!slug || isSaving}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button onClick={() => handleSave("published")} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Publish
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Featured Image */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader value={featuredImage} onChange={setFeaturedImage} />
          </CardContent>
        </Card>

        {/* Category & Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" size="icon" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="seo-title">SEO Title</Label>
                  <Input
                    id="seo-title"
                    placeholder={title || "SEO title..."}
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">{(seoTitle || title).length}/60 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo-description">Meta Description</Label>
                  <Textarea
                    id="seo-description"
                    placeholder={excerpt || "Meta description..."}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <p className="text-xs text-muted-foreground">{(seoDescription || excerpt).length}/160 characters</p>
                </div>
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Keywords</Label>
                  <Input
                    placeholder="keyword1, keyword2, keyword3"
                    value={seoKeywords.join(", ")}
                    onChange={(e) =>
                      setSeoKeywords(
                        e.target.value
                          .split(",")
                          .map((k) => k.trim())
                          .filter(Boolean),
                      )
                    }
                  />
                  <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
