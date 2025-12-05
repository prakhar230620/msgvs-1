"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, X, MoreHorizontal, Search, MessageSquare, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { toast } from "sonner"

interface Comment {
  id: string
  blog_id: string
  user_name: string
  user_email: string
  content: string
  status: "pending" | "approved" | "rejected"
  likes: number
  created_at: string
  blogs?: {
    title: string
    slug: string
  }
}

interface CommentsTableProps {
  comments: Comment[]
}

export function CommentsTable({ comments }: CommentsTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const router = useRouter()

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.user_name.toLowerCase().includes(search.toLowerCase()) ||
      comment.content.toLowerCase().includes(search.toLowerCase()) ||
      comment.user_email.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === "all" || comment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const supabase = createClient()

    const { error } = await supabase.from("comments").update({ status }).eq("id", id)

    if (error) {
      toast.error("Failed to update comment status")
    } else {
      toast.success(`Comment ${status}`)
      router.refresh()
    }
  }

  const deleteComment = async (id: string) => {
    const supabase = createClient()

    const { error } = await supabase.from("comments").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete comment")
    } else {
      toast.success("Comment deleted")
      router.refresh()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No comments yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comment</TableHead>
              <TableHead>Post</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell>
                  <div className="max-w-[300px]">
                    <p className="font-medium">{comment.user_name}</p>
                    <p className="text-xs text-muted-foreground mb-1">{comment.user_email}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{comment.content}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {comment.blogs && (
                    <Link
                      href={`/blogs/${comment.blogs.slug}`}
                      target="_blank"
                      className="text-sm hover:underline flex items-center gap-1"
                    >
                      {comment.blogs.title.slice(0, 30)}...
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(comment.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {comment.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600"
                          onClick={() => updateStatus(comment.id, "approved")}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => updateStatus(comment.id, "rejected")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {comment.status !== "approved" && (
                          <DropdownMenuItem onClick={() => updateStatus(comment.id, "approved")}>
                            Approve
                          </DropdownMenuItem>
                        )}
                        {comment.status !== "rejected" && (
                          <DropdownMenuItem onClick={() => updateStatus(comment.id, "rejected")}>
                            Reject
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => deleteComment(comment.id)} className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
