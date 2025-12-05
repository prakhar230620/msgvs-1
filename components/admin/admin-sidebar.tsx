"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  Mail,
  FileEdit,
  Home,
  Globe,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"
import type { AdminUser } from "@/lib/types"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
]

const contentNavItems = [
  {
    title: "Blog Posts",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    title: "Media Library",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    title: "Gallery",
    href: "/admin/gallery",
    icon: ImageIcon,
  },
  {
    title: "Pages",
    href: "/admin/pages",
    icon: FileEdit,
  },
]

const engagementNavItems = [
  {
    title: "Comments",
    href: "/admin/comments",
    icon: MessageSquare,
  },
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
  },
  {
    title: "Contact Forms",
    href: "/admin/contacts",
    icon: Users,
  },
]

const settingsNavItems = [
  {
    title: "Site Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

interface AdminSidebarProps {
  user: AdminUser
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden border border-primary/20">
            {/* Use Image component for logo */}
            <img
              src="/images/whatsapp-20image-202025-11-30-20at-207.jpeg"
              alt="Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-xs leading-tight">Maa Santoshi Gramin<br />Vikas Samiti</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="border border-transparent data-[active=true]:border-primary/20 data-[active=true]:bg-primary/5"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                    className="border border-transparent data-[active=true]:border-primary/20 data-[active=true]:bg-primary/5"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Engagement</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {engagementNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="border border-transparent data-[active=true]:border-primary/20 data-[active=true]:bg-primary/5"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="border border-transparent data-[active=true]:border-primary/20 data-[active=true]:bg-primary/5"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span>Toggle Theme</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" target="_blank">
                <Home className="h-4 w-4" />
                <span>View Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-2 py-3">
          <p className="text-xs text-muted-foreground">
            Logged in as <span className="font-medium text-foreground">{user.display_name || user.email}</span>
          </p>
          <p className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
