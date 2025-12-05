"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, ThumbsUp, Reply, Loader2, Send, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import type { Comment } from "@/lib/types"

interface CommentsSectionProps {
  blogId: string
}

export function CommentsSection({ blogId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  useEffect(() => {
    fetchComments()
  }, [blogId])

  const fetchComments = async () => {
    const supabase = createClient()

    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("blog_id", blogId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })

    setComments(data || [])
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !content.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    const supabase = createClient()

    const { error } = await supabase.from("comments").insert({
      blog_id: blogId,
      user_name: name,
      user_email: email,
      content,
      parent_comment_id: replyingTo,
      status: "pending",
    })

    if (error) {
      toast.error("Failed to submit comment. Please try again.")
    } else {
      toast.success("Comment submitted! It will appear after moderation.")
      setContent("")
      setReplyingTo(null)
    }

    setIsSubmitting(false)
  }

  const handleLike = async (commentId: string) => {
    const supabase = createClient()

    const comment = comments.find((c) => c.id === commentId)
    if (!comment) return

    const { error } = await supabase
      .from("comments")
      .update({ likes: comment.likes + 1 })
      .eq("id", commentId)

    if (!error) {
      setComments(comments.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c)))
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Organize comments into threads
  const parentComments = comments.filter((c) => !c.parent_comment_id)
  const getReplies = (parentId: string) => comments.filter((c) => c.parent_comment_id === parentId)

  return (
    <section className="py-12 border-t">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Comments ({comments.length})
        </h2>

        {/* Comment Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Leave a Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {replyingTo && (
                <div className="flex items-center gap-2 text-sm bg-muted p-3 rounded-lg">
                  <Reply className="h-4 w-4" />
                  <span>Replying to a comment</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </Button>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your thoughts..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[120px]"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Comments are moderated before appearing
                </p>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Comments List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {parentComments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <CommentItem
                    comment={comment}
                    onLike={handleLike}
                    onReply={(id) => {
                      setReplyingTo(id)
                      document.getElementById("comment")?.focus()
                    }}
                    getInitials={getInitials}
                  />
                  {/* Replies */}
                  {getReplies(comment.id).length > 0 && (
                    <div className="ml-12 mt-4 space-y-4 border-l-2 border-muted pl-4">
                      {getReplies(comment.id).map((reply) => (
                        <CommentItem
                          key={reply.id}
                          comment={reply}
                          onLike={handleLike}
                          onReply={(id) => {
                            setReplyingTo(id)
                            document.getElementById("comment")?.focus()
                          }}
                          getInitials={getInitials}
                          isReply
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}

interface CommentItemProps {
  comment: Comment
  onLike: (id: string) => void
  onReply: (id: string) => void
  getInitials: (name: string) => string
  isReply?: boolean
}

function CommentItem({ comment, onLike, onReply, getInitials, isReply }: CommentItemProps) {
  return (
    <div className={`flex gap-4 ${isReply ? "" : "p-4 bg-muted/30 rounded-lg"}`}>
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary text-sm">{getInitials(comment.user_name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{comment.user_name}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-3">{comment.content}</p>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => onLike(comment.id)}>
            <ThumbsUp className="h-3.5 w-3.5 mr-1" />
            {comment.likes > 0 && comment.likes}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => onReply(comment.id)}>
            <Reply className="h-3.5 w-3.5 mr-1" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  )
}
