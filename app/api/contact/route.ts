import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { compressText } from "@/lib/utils/compression"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      subject: compressText(subject),
      message: compressText(message),
      status: "unread",
    })

    if (error) {
      console.error("Contact submission error:", error)
      return NextResponse.json({ error: "Failed to submit message" }, { status: 500 })
    }

    // Send email notification to admin
    try {
      const { sendEmail } = await import("@/lib/email")
      await sendEmail({
        to: "vidhyachoure17@gmail.com",
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      })
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // We don't fail the request if email fails, as the DB insert succeeded
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
