import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsOverview } from "@/components/admin/analytics-overview"
import { TopPosts } from "@/components/admin/top-posts"
import { TrendingUp, Users, Eye, Clock } from "lucide-react"
import { startOfDay, subDays, format } from "date-fns"

async function getAnalyticsData() {
  const supabase = await createClient()

  // Get all published blogs for stats and category breakdown
  const { data: blogs } = await supabase
    .from("blogs")
    .select("id, title, slug, views, created_at, category")
    .eq("status", "published")
    .order("views", { ascending: false })

  const totalViews = blogs?.reduce((acc, blog) => acc + blog.views, 0) || 0
  const topPosts = blogs?.slice(0, 10) || []

  // Category Breakdown
  const categoryMap = new Map<string, number>()
  blogs?.forEach((blog) => {
    const cat = blog.category || "Uncategorized"
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
  })
  const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  // Get subscribers
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("created_at")
    .eq("status", "active")

  // Get contact messages
  const { data: messages } = await supabase
    .from("contact_submissions")
    .select("created_at")

  // Growth Data (Last 7 Days)
  const growthData = []
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const dateStr = format(date, "EEE") // Mon, Tue, etc.
    const start = startOfDay(date).toISOString()
    const end = startOfDay(subDays(date, -1)).toISOString()

    const newSubscribers = subscribers?.filter(s => s.created_at >= start && s.created_at < end).length || 0
    const newMessages = messages?.filter(m => m.created_at >= start && m.created_at < end).length || 0

    growthData.push({
      date: dateStr,
      subscribers: newSubscribers,
      messages: newMessages
    })
  }

  const subscriberCount = subscribers?.length || 0
  const commentCount = messages?.length || 0 // Using messages as proxy for "engagement" if comments table is empty/not used heavily yet

  return {
    totalViews,
    totalPosts: blogs?.length || 0,
    topPosts,
    commentCount,
    subscriberCount,
    categoryData,
    growthData
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData()

  const stats = [
    {
      title: "Total Page Views",
      value: data.totalViews.toLocaleString(),
      description: "All-time views across all posts",
      icon: Eye,
    },
    {
      title: "Published Posts",
      value: data.totalPosts,
      description: "Total published blog posts",
      icon: TrendingUp,
    },
    {
      title: "Messages",
      value: data.commentCount,
      description: "Total contact messages",
      icon: Users,
    },
    {
      title: "Subscribers",
      value: data.subscriberCount,
      description: "Active newsletter subscribers",
      icon: Clock,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Track your site performance and engagement metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Tables */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Top Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <AnalyticsOverview growthData={data.growthData} categoryData={data.categoryData} />
        </TabsContent>
        <TabsContent value="posts">
          <TopPosts posts={data.topPosts} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
