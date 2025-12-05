import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { compressText } from "@/lib/utils/compression"
import { sendWelcomeEmail, sendAdminNotificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", compressText(email))
      .single()

    if (existing) {
      if (existing.status === "active") {
        return NextResponse.json({ error: "Email already subscribed" }, { status: 400 })
      }
      // Reactivate if unsubscribed
      await supabase
        .from("newsletter_subscribers")
        .update({ status: "active", confirmed_at: new Date().toISOString() })
        .eq("id", existing.id)
    } else {
      // ... inside POST ...
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email: compressText(email),
        status: "active",
        confirmed_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Newsletter subscription error:", error)
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
      }

      // Send emails
      await Promise.all([
        sendWelcomeEmail(email),
        sendAdminNotificationEmail(email)
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Newsletter API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
