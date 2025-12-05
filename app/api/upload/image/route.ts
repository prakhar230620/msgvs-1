import { NextRequest, NextResponse } from "next/server"
import { Storage } from "@google-cloud/storage"

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
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

        // Initialize Storage
        const storage = new Storage({
            projectId,
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
        })
        const bucket = storage.bucket(bucketName)

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = `images/${Date.now()}-${file.name}`
        const blob = bucket.file(filename)

        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file.type,
        })

        return new Promise((resolve, reject) => {
            blobStream.on("error", (err) => {
                console.error("GCS Upload Error:", err)
                resolve(NextResponse.json({ error: "Upload failed" }, { status: 500 }))
            })

            blobStream.on("finish", () => {
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                resolve(NextResponse.json({ url: publicUrl }))
            })

            blobStream.end(buffer)
        })
    } catch (error) {
        console.error("Upload handler error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
