import { NextRequest, NextResponse } from "next/server"
import { Storage } from "@google-cloud/storage"

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json()

        if (!url) {
            return NextResponse.json({ error: "No URL provided" }, { status: 400 })
        }

        // Check for credentials
        const projectId = process.env.GCS_PROJECT_ID
        const clientEmail = process.env.GCS_CLIENT_EMAIL
        const privateKey = process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, "\n")
        const bucketName = process.env.GCS_BUCKET_NAME

        if (!projectId || !clientEmail || !privateKey || !bucketName) {
            return NextResponse.json(
                { error: "Server configuration error: Missing GCS credentials" },
                { status: 500 },
            )
        }

        const storage = new Storage({
            projectId,
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
        })
        const bucket = storage.bucket(bucketName)

        // Extract filename from URL
        // URL format: https://storage.googleapis.com/BUCKET_NAME/FILENAME
        const urlParts = url.split(`https://storage.googleapis.com/${bucketName}/`)
        if (urlParts.length !== 2) {
            return NextResponse.json({ error: "Invalid URL for this bucket" }, { status: 400 })
        }

        const filename = urlParts[1]
        const file = bucket.file(filename)

        // 1. Delete from GCS
        await file.delete()

        // 2. Delete from Supabase Gallery table (if it exists there)
        // We use the service role key to bypass RLS if needed, or just standard client if RLS allows
        // Since this is an admin route, we should use a client with appropriate permissions.
        // Assuming we have process.env.NEXT_PUBLIC_SUPABASE_URL and process.env.SUPABASE_SERVICE_ROLE_KEY

        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            const { createClient } = require('@supabase/supabase-js')
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            )

            const { error: dbError } = await supabase
                .from('gallery')
                .delete()
                .eq('image_url', url)

            if (dbError) {
                console.error("Failed to delete from gallery table:", dbError)
                // We don't stop execution, as the file is already deleted
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Delete handler error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
