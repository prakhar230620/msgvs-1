"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Save, User, Mail, Lock } from "lucide-react"
import type { AdminUser } from "@/lib/types"

interface ProfileFormProps {
    user: AdminUser
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [displayName, setDisplayName] = useState(user.display_name || "")
    const [email, setEmail] = useState(user.email || "")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const router = useRouter()

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const supabase = createClient()

        try {
            // 1. Update Display Name (in public.users table via trigger or metadata)
            // For now, we update user metadata which usually syncs to public.users if set up,
            // or we update the public.users table directly if RLS allows.
            // Let's try updating metadata first.
            const { error: metadataError } = await supabase.auth.updateUser({
                data: { display_name: displayName },
            })

            if (metadataError) throw metadataError

            // 2. Update Email (if changed)
            if (email !== user.email) {
                const { error: emailError } = await supabase.auth.updateUser({ email })
                if (emailError) throw emailError
                toast.info("Confirmation email sent to new address")
            }

            // 3. Update Password (if provided)
            if (password) {
                if (password !== confirmPassword) {
                    toast.error("Passwords do not match")
                    setIsLoading(false)
                    return
                }
                const { error: passwordError } = await supabase.auth.updateUser({ password })
                if (passwordError) throw passwordError
                toast.success("Password updated successfully")
            }

            toast.success("Profile updated successfully")
            router.refresh()
        } catch (error) {
            console.error("Profile update error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to update profile")
        } finally {
            setIsLoading(false)
            setPassword("")
            setConfirmPassword("")
        }
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and public profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="displayName"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="pl-9"
                                    placeholder="Your Name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-9"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Changing your email will require confirmation.
                            </p>
                        </div>

                        <div className="space-y-2 pt-4 border-t">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-9"
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-9"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
