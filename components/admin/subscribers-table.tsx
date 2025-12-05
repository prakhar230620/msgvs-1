"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { decompressText } from "@/lib/utils/compression"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Download, Mail, MoreHorizontal, Trash2, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface Subscriber {
  id: string
  email: string
  status: "pending" | "active" | "unsubscribed"
  subscribed_at: string
  confirmed_at: string | null
}

interface SubscribersTableProps {
  subscribers: Subscriber[]
}

export function SubscribersTable({ subscribers }: SubscribersTableProps) {
  const [search, setSearch] = useState("")
  const router = useRouter()

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const email = decompressText(subscriber.email) || subscriber.email
    return email.toLowerCase().includes(search.toLowerCase())
  })

  const updateStatus = async (id: string, status: "active" | "unsubscribed") => {
    const supabase = createClient()

    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({
        status,
        confirmed_at: status === "active" ? new Date().toISOString() : null,
        unsubscribed_at: status === "unsubscribed" ? new Date().toISOString() : null,
      })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update subscriber")
    } else {
      toast.success("Subscriber updated")
      router.refresh()
    }
  }

  const deleteSubscriber = async (id: string) => {
    const supabase = createClient()

    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete subscriber")
    } else {
      toast.success("Subscriber deleted")
      router.refresh()
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Email", "Status", "Subscribed At", "Confirmed At"].join(","),
      ...filteredSubscribers.map((s) => {
        const email = decompressText(s.email) || s.email
        return [email, s.status, s.subscribed_at, s.confirmed_at || ""].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Subscribers exported to CSV")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>
      case "unsubscribed":
        return <Badge variant="secondary">Unsubscribed</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  if (subscribers.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No subscribers yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscribed</TableHead>
              <TableHead>Confirmed</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className="font-medium">{decompressText(subscriber.email) || subscriber.email}</TableCell>
                <TableCell>{getStatusBadge(subscriber.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(subscriber.subscribed_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {subscriber.confirmed_at ? format(new Date(subscriber.confirmed_at), "MMM d, yyyy") : "-"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {subscriber.status !== "active" && (
                        <DropdownMenuItem onClick={() => updateStatus(subscriber.id, "active")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Active
                        </DropdownMenuItem>
                      )}
                      {subscriber.status !== "unsubscribed" && (
                        <DropdownMenuItem onClick={() => updateStatus(subscriber.id, "unsubscribed")}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Unsubscribe
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteSubscriber(subscriber.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
