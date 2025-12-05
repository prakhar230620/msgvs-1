"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AnalyticsOverviewProps {
  growthData: {
    date: string
    subscribers: number
    messages: number
  }[]
  categoryData: {
    name: string
    value: number
  }[]
}

export function AnalyticsOverview({ growthData, categoryData }: AnalyticsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Growth Overview</CardTitle>
          <CardDescription>New subscribers and messages over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              subscribers: {
                label: "New Subscribers",
                color: "var(--chart-1)",
              },
              messages: {
                label: "New Messages",
                color: "var(--chart-2)",
              },
            }}
            className="h-[300px] min-h-[300px]"
          >
            <div style={{ width: "100%", height: "100%", minHeight: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-subscribers)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-subscribers)" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-messages)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-messages)" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
                  <XAxis dataKey="date" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
                  <YAxis className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="subscribers"
                    stroke="var(--color-subscribers)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSubscribers)"
                  />
                  <Area
                    type="monotone"
                    dataKey="messages"
                    stroke="var(--color-messages)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMessages)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Content by Category</CardTitle>
          <CardDescription>Number of posts per category</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Posts",
                color: "var(--chart-1)",
              },
            }}
            className="h-[300px] min-h-[300px]"
          >
            <div style={{ width: "100%", height: "100%", minHeight: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" className="text-xs text-muted-foreground" allowDecimals={false} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" className="text-xs text-muted-foreground" width={100} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
