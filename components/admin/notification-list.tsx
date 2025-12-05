"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, MessageSquare, Mail, Info, CheckCircle, AlertTriangle, XCircle, Trash2 } from "lucide-react"
import { Notification } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { decompressText } from "@/lib/utils/compression"

interface NotificationListProps {
    initialNotifications: Notification[]
}

export function NotificationList({ initialNotifications }: NotificationListProps) {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
    const router = useRouter()
    const supabase = createClient()

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from("notifications").delete().eq("id", id)

            if (error) throw error

            setNotifications((prev) => prev.filter((n) => n.id !== id))
            toast.success("Notification deleted")
            router.refresh() // Refresh server components to update header count
        } catch (error) {
            console.error("Error deleting notification:", error)
            toast.error("Failed to delete notification")
        }
    }

    const handleMarkAsRead = async (id: string) => {
        try {
            const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id)

            if (error) throw error

            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            )
            router.refresh()
        } catch (error) {
            console.error("Error updating notification:", error)
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "info":
                return <Info className="h-4 w-4 text-blue-500" />
            case "success":
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case "warning":
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />
            case "error":
                return <XCircle className="h-4 w-4 text-red-500" />
            default:
                return <Bell className="h-4 w-4" />
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>
                    You have {notifications.filter((n) => !n.read).length} unread notifications.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No notifications found.</p>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`flex items-start gap-4 rounded-lg border p-4 transition-colors group ${!notification.read ? "bg-muted/50" : ""
                                    }`}
                                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                            >
                                <div className="mt-1 rounded-full border p-2 bg-background">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 space-y-1 cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium leading-none">{decompressText(notification.title) || notification.title}</p>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{decompressText(notification.message) || notification.message}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!notification.read && (
                                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                            New
                                        </Badge>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(notification.id)
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
