import { createClient } from "@/lib/supabase/client"
import { Storage } from "@google-cloud/storage"
import { compressText, compressImage } from "@/lib/utils/compression"

// Initialize Supabase Client
const supabase = createClient()

// Initialize Google Cloud Storage (This will only work server-side or with a proxy)
// For client-side uploads, we should use signed URLs.
// Since we are in a Next.js app, we can use API routes for GCS operations.
// For now, I'll define the interface and basic logic.

/**
 * Uploads user data (email/profile) to Supabase with compression.
 * @param table The table name (e.g., 'newsletter_subscribers').
 * @param data The data object to upload.
 */
export async function uploadUserData(table: string, data: any) {
    // Compress string fields
    const compressedData = { ...data }
    for (const key in compressedData) {
        if (typeof compressedData[key] === "string" && compressedData[key].length > 100) {
            compressedData[key] = compressText(compressedData[key])
        }
    }

    const { error } = await supabase.from(table).insert(compressedData)
    if (error) throw error
    return true
}

/**
 * Uploads a blog image to Google Cloud Storage with compression.
 * @param file The image file.
 * @returns The public URL of the uploaded image.
 */
export async function uploadBlogImage(file: File): Promise<string> {
    // 1. Compress Image
    const compressedFile = await compressImage(file, 0.1) // 100KB limit

    // 2. Upload to GCS (via API Route - to be implemented)
    // We need an API route to handle the actual upload to GCS to keep secrets safe.
    const formData = new FormData()
    formData.append("file", compressedFile)

    const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
    })

    if (!response.ok) {
        throw new Error("Failed to upload image")
    }

    const { url } = await response.json()
    return url
}

/**
 * Uploads blog text content to Google Cloud Storage with compression.
 * @param content The blog content (HTML/Markdown).
 * @returns The public URL or path to the stored text.
 */
export async function uploadBlogText(content: string): Promise<string> {
    // 1. Compress Text
    const compressedContent = compressText(content)

    // 2. Upload to GCS (via API Route)
    const response = await fetch("/api/upload/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: compressedContent }),
    })

    if (!response.ok) {
        throw new Error("Failed to upload text")
    }

    const { url } = await response.json()
    return url
}
