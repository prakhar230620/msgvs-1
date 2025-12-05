import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CommentsTable } from "@/components/admin/comments-table"

async function getComments() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("comments")
    .select(`
      *,
      blogs (
        title,
        slug
      )
    `)
    .order("created_at", { ascending: false })

  return data || []
}

export default async function CommentsPage() {
  const comments = await getComments()

  const pendingCount = comments.filter((c) => c.status === "pending").length
  const approvedCount = comments.filter((c) => c.status === "approved").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Comments</h1>
        <p className="text-muted-foreground">Moderate and manage comments on your blog posts.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comments.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Comments</CardTitle>
          <CardDescription>Review, approve, or reject comments submitted by visitors.</CardDescription>
        </CardHeader>
        <CardContent>
          <CommentsTable comments={comments} />
        </CardContent>
      </Card>
    </div>
  )
}
