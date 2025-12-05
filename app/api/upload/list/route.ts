import { NextResponse } from "next/server"
import { Storage } from "@google-cloud/storage"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
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

        // List files with 'images/' prefix
        const [files] = await bucket.getFiles({ prefix: 'images/' })

        const fileList = files.map(file => {
            return {
                name: file.name,
                url: `https://storage.googleapis.com/${bucketName}/${file.name}`,
                updated: file.metadata.updated
            }
        })

        // Sort by newest first
        fileList.sort((a, b) => {
            const dateA = new Date(a.updated || 0).getTime()
            const dateB = new Date(b.updated || 0).getTime()
            return dateB - dateA
        })

        return NextResponse.json({ files: fileList })
    } catch (error) {
        console.error("List handler error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
