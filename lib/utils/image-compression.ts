export async function compressImage(file: File, maxSizeKB = 100): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (event) => {
      const img = new window.Image()
      img.src = event.target?.result as string

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Calculate new dimensions (max 1920px width)
        let { width, height } = img
        const maxWidth = 1920

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height)

        // Start with quality 0.9 and reduce until size is acceptable
        let quality = 0.9
        const maxSize = maxSizeKB * 1024

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Could not create blob"))
                return
              }

              if (blob.size > maxSize && quality > 0.1) {
                quality -= 0.1
                tryCompress()
              } else {
                resolve(blob)
              }
            },
            "image/webp",
            quality,
          )
        }

        tryCompress()
      }

      img.onerror = () => reject(new Error("Could not load image"))
    }

    reader.onerror = () => reject(new Error("Could not read file"))
  })
}

// Convert blob to base64
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Calculate compression ratio
export function getCompressionRatio(originalSize: number, compressedSize: number): number {
  return Math.round((1 - compressedSize / originalSize) * 100)
}
