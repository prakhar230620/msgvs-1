"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, LogOut, User, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { AdminUser } from "@/lib/types"
import { decompressText } from "@/lib/utils/compression"

interface AdminHeaderProps {
  user: AdminUser
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()

  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      const supabase = createClient()

      // Fetch latest 5 for dropdown
      const { data: latest } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      if (latest) {
        setNotifications(latest)
      }

      // Fetch accurate unread count
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("read", false)

      setUnreadCount(count || 0)
    }

    fetchNotifications()

    // Subscribe to realtime changes
    const supabase = createClient()
    const channel = supabase
      .channel('notifications-header')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchNotifications()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const [searchQuery, setSearchQuery] = useState("")

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return

    const routes: Record<string, string> = {
      blog: "/admin/blogs",
      blogs: "/admin/blogs",
      post: "/admin/blogs",
      posts: "/admin/blogs",
      contact: "/admin/contacts",
      contacts: "/admin/contacts",
      message: "/admin/contacts",
      messages: "/admin/contacts",
      setting: "/admin/settings",
      settings: "/admin/settings",
      profile: "/admin/profile",
      account: "/admin/profile",
      gallery: "/admin/gallery",
      image: "/admin/gallery",
      images: "/admin/gallery",
      media: "/admin/media",
      file: "/admin/media",
      files: "/admin/media",
      newsletter: "/admin/newsletter",
      subscriber: "/admin/newsletter",
      subscribers: "/admin/newsletter",
      comment: "/admin/comments",
      comments: "/admin/comments",
      page: "/admin/pages",
      pages: "/admin/pages",
    }

    const target = routes[query] || Object.keys(routes).find((key) => key.includes(query)) ? routes[Object.keys(routes).find((key) => key.includes(query)) as string] : null

    if (target) {
      router.push(target)
      setSearchQuery("")
    } else {
      const partialMatch = Object.keys(routes).find(key => key.includes(query))
      if (partialMatch) {
        router.push(routes[partialMatch])
        setSearchQuery("")
      }
    }
  }

  const initials = user.display_name
    ? user.display_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : user.email[0].toUpperCase()

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="-ml-2" />

      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search pages (e.g. Blogs, Settings)..."
            className="w-full pl-9 bg-background border-input border focus-visible:ring-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" suppressHydrationWarning>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-background">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id}>
                    <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1 p-3">
                      <div className="flex items-center gap-2 w-full">
                        <span className={`h-2 w-2 rounded-full ${notification.type === 'success' ? 'bg-green-500' :
                          notification.type === 'warning' ? 'bg-yellow-500' :
                            notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                          }`} />
                        <span className="font-medium text-sm">{decompressText(notification.title) || notification.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {decompressText(notification.message) || notification.message}
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                ))
              )}
            </div>
            <DropdownMenuItem asChild>
              <a href="/admin/notifications" className="justify-center text-primary cursor-pointer font-medium w-full flex">
                View all notifications
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full" suppressHydrationWarning>
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatar_url || undefined} alt={user.display_name || user.email} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.display_name || "Admin"}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/admin/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
