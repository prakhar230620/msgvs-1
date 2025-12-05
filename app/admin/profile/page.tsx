import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/admin/profile-form"

export default async function AdminProfilePage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    // Transform Supabase user to AdminUser type
    const adminUser = {
        id: user.id,
        email: user.email!,
        display_name: user.user_metadata?.display_name || "",
        avatar_url: user.user_metadata?.avatar_url || null,
        role: user.user_metadata?.role || "admin",
        created_at: user.created_at,
        last_login: user.last_sign_in_at || null,
        updated_at: user.updated_at || new Date().toISOString(),
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <div className="max-w-2xl">
                <ProfileForm user={adminUser} />
            </div>
        </div>
    )
}
