import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Eye, MessageSquare, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { RecentActivity } from "@/components/admin/recent-activity"

async function getDashboardStats() {
  const supabase = await createClient()

  const [blogsResult, commentsResult, subscribersResult, viewsResult] = await Promise.all([
    supabase.from("blogs").select("id", { count: "exact" }),
    supabase.from("comments").select("id", { count: "exact" }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact" }).eq("status", "active"),
    supabase.from("blogs").select("views"),
  ])

  const totalViews = viewsResult.data?.reduce((acc, blog) => acc + (blog.views || 0), 0) || 0

  return {
    totalBlogs: blogsResult.count || 0,
    totalComments: commentsResult.count || 0,
    totalSubscribers: subscribersResult.count || 0,
    totalViews,
  }
}

async function getRecentBlogs() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("blogs")
    .select("id, title, status, views, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  return data || []
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const recentBlogs = await getRecentBlogs()

  // Fetch growth data for the last 7 days
  const supabase = await createClient()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: recentSubscribers } = await supabase
    .from("newsletter_subscribers")
    .select("created_at")
    .gte("created_at", sevenDaysAgo.toISOString())

  const { data: recentMessages } = await supabase
    .from("contact_submissions")
    .select("created_at")
    .gte("created_at", sevenDaysAgo.toISOString())

  const { data: allBlogs } = await supabase
    .from("blogs")
    .select("status, views")

  // Process growth data
  const growthData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-US', { weekday: 'short' })

    return {
      date: label,
      subscribers: recentSubscribers?.filter(s => s.created_at.startsWith(dateStr)).length || 0,
      messages: recentMessages?.filter(m => m.created_at.startsWith(dateStr)).length || 0,
    }
  })

  // Process blog status
  const publishedCount = allBlogs?.filter(b => b.status === "published").length || 0
  const draftCount = allBlogs?.filter(b => b.status === "draft").length || 0
  const statusData = [
    { status: "Published", value: publishedCount },
    { status: "Draft", value: draftCount },
  ]

  // Process engagement
  const totalViews = allBlogs?.reduce((acc, b) => acc + (b.views || 0), 0) || 0
  const avgViews = allBlogs?.length ? Math.round(totalViews / allBlogs.length) : 0
  const engagementData = {
    avgViews,
    totalViews,
    publishedCount,
  }

  const statCards = [
    {
      title: "Total Blog Posts",
      value: stats.totalBlogs,
      description: "Published and draft posts",
      icon: FileText,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      description: "All-time page views",
      icon: Eye,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Comments",
      value: stats.totalComments,
      description: "Pending and approved",
      icon: MessageSquare,
      trend: "+23%",
      trendUp: true,
    },
    {
      title: "Subscribers",
      value: stats.totalSubscribers,
      description: "Active newsletter subscribers",
      icon: Users,
      trend: "+5%",
      trendUp: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your site.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className={`flex items-center ${stat.trendUp ? "text-green-600" : "text-red-600"}`}>
                  {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.trend}
                </span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth Overview
            </CardTitle>
            <CardDescription>New subscribers and messages (Last 7 Days)</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardCharts
              growthData={growthData}
              statusData={statusData}
              engagementData={engagementData}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest blog posts and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity blogs={recentBlogs} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
