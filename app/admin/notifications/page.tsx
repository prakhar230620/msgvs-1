import { createClient } from "@/lib/supabase/server"
import { NotificationList } from "@/components/admin/notification-list"

export default async function NotificationsPage() {
    const supabase = await createClient()
    const { data: notifications, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching notifications:", error)
    }



    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground">Manage and view all your system notifications.</p>
            </div>

            <NotificationList initialNotifications={notifications || []} />
        </div>
    )
}
