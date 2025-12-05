import LZString from "lz-string"
import imageCompression from "browser-image-compression"

/**
 * Compresses text using LZ-String.
 * @param text The text to compress.
 * @returns The compressed string.
 */
export function compressText(text: string): string {
  try {
    return LZString.compressToUTF16(text)
  } catch (error) {
    console.error("Error compressing text:", error)
    return text
  }
}

/**
 * Decompresses text using LZ-String.
 * @param compressedText The compressed string.
 * @returns The original text.
 */
export function decompressText(compressedText: string): string {
  try {
    return LZString.decompressFromUTF16(compressedText) || ""
  } catch (error) {
    console.error("Error decompressing text:", error)
    return ""
  }
}

/**
 * Compresses an image file using browser-image-compression.
 * @param file The image file to compress.
 * @param maxSizeMB The maximum size in MB (default: 0.1MB = 100KB).
 * @param maxWidthOrHeight The maximum width or height (default: 1920).
 * @returns The compressed file.
 */
export async function compressImage(
  file: File,
  maxSizeMB = 0.1,
  maxWidthOrHeight = 1920,
): Promise<File> {
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
  }

  try {
    return await imageCompression(file, options)
  } catch (error) {
    console.error("Error compressing image:", error)
    return file
  }
}

/**
 * Generates a URL-friendly slug from a string.
 * @param text The text to slugify.
 * @returns The slug.
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

/**
 * Calculates the reading time of a text.
 * @param text The text to calculate reading time for.
 * @returns The reading time in minutes.
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
