import { NextRequest, NextResponse } from "next/server"
import { Storage } from "@google-cloud/storage"

export async function POST(req: NextRequest) {
    try {
        const { content } = await req.json()

        if (!content) {
            return NextResponse.json({ error: "No content provided" }, { status: 400 })
        }

        // Check for credentials
        const projectId = process.env.GCS_PROJECT_ID
        const clientEmail = process.env.GCS_CLIENT_EMAIL
        const privateKey = process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, "\n")
        const bucketName = process.env.GCS_BUCKET_NAME

        if (!projectId || !clientEmail || !privateKey || !bucketName) {
            console.error("Missing GCS credentials")
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

        const filename = `blogs/${Date.now()}.txt`
        const file = bucket.file(filename)

        await file.save(content, {
            contentType: "text/plain",
            resumable: false,
        })

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`
        return NextResponse.json({ url: publicUrl })
    } catch (error) {
        console.error("Upload handler error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
