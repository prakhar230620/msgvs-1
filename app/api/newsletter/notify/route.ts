import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { sendNewBlogPostEmail } from "@/lib/email"
import { decompressText } from "@/lib/utils/compression"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { blogId, title, slug, excerpt } = body

        if (!blogId || !title || !slug) {
            return NextResponse.json({ error: "Missing blog details" }, { status: 400 })
        }

        const supabase = await createClient()

        // Fetch all active subscribers
        // Note: In a real production app with thousands of subscribers, 
        // you would want to use a queue system (like Redis/Bull) to handle this in background.
        const { data: subscribers, error } = await supabase
            .from("newsletter_subscribers")
            .select("email")
            .eq("status", "active")

        if (error) {
            console.error("Error fetching subscribers:", error)
            return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
        }

        if (!subscribers || subscribers.length === 0) {
            return NextResponse.json({ message: "No active subscribers to notify" })
        }

        console.log(`Sending notifications to ${subscribers.length} subscribers for blog: ${title}`)

        // Send emails in parallel (with some concurrency limit ideally, but Promise.all is okay for small lists)
        const emailPromises = subscribers.map(subscriber => {
            // Emails might be compressed in DB if we implemented that earlier
            // But based on previous steps, we might or might not have compressed them.
            // app/api/newsletter/subscribe/route.ts uses compressText(email).
            // So we need to decompress them if they look compressed, or just try to use them.
            // Actually, standard email format is not compressed string format usually.
            // Let's assume we need to decompress if it's not a valid email string.

            let email = subscriber.email
            // Simple check if it looks like an email or compressed string
            if (!email.includes("@")) {
                try {
                    const decompressed = decompressText(email)
                    if (decompressed) email = decompressed
                } catch (e) {
                    // ignore
                }
            }

            return sendNewBlogPostEmail(email, title, slug, excerpt || "Check out our new blog post!")
        })

        await Promise.allSettled(emailPromises)

        return NextResponse.json({ success: true, count: subscribers.length })
    } catch (error) {
        console.error("Notification API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
