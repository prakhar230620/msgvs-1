"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DashboardChartsProps {
  growthData: {
    date: string
    subscribers: number
    messages: number
  }[]
  statusData?: any
  engagementData?: any
}

export function DashboardCharts({ growthData }: DashboardChartsProps) {
  return (
    <ChartContainer
      config={{
        subscribers: {
          label: "New Subscribers",
          color: "hsl(var(--primary))",
        },
        messages: {
          label: "Messages",
          color: "hsl(var(--destructive))",
        },
      }}
      className="h-[300px] min-h-[300px] w-full"
    >
      <div style={{ width: "100%", height: "100%", minHeight: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-subscribers)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-subscribers)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-messages)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-messages)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="subscribers"
              stroke="var(--color-subscribers)"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorSubscribers)"
            />
            <Area
              type="monotone"
              dataKey="messages"
              stroke="var(--color-messages)"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorMessages)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}
