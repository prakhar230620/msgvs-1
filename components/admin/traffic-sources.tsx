"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Globe, Search, Share2, Mail, Link2 } from "lucide-react"

const trafficSources = [
  { source: "Organic Search", value: 45, icon: Search, color: "bg-blue-500" },
  { source: "Direct", value: 25, icon: Globe, color: "bg-green-500" },
  { source: "Social Media", value: 18, icon: Share2, color: "bg-purple-500" },
  { source: "Email", value: 8, icon: Mail, color: "bg-orange-500" },
  { source: "Referral", value: 4, icon: Link2, color: "bg-pink-500" },
]

const topReferrers = [
  { domain: "google.com", visits: 1250 },
  { domain: "facebook.com", visits: 480 },
  { domain: "twitter.com", visits: 320 },
  { domain: "linkedin.com", visits: 180 },
  { domain: "instagram.com", visits: 150 },
]

export function TrafficSources() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>Where your visitors come from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg ${source.color} bg-opacity-10 flex items-center justify-center`}
                    >
                      <source.icon className={`h-4 w-4 ${source.color.replace("bg-", "text-")}`} />
                    </div>
                    <span className="text-sm font-medium">{source.source}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{source.value}%</span>
                </div>
                <Progress value={source.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Referrers</CardTitle>
          <CardDescription>Sites sending traffic to you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topReferrers.map((referrer, index) => (
              <div key={referrer.domain} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-5">{index + 1}.</span>
                  <span className="text-sm font-medium">{referrer.domain}</span>
                </div>
                <span className="text-sm text-muted-foreground">{referrer.visits.toLocaleString()} visits</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
