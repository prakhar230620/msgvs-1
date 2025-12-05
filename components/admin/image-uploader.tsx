"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Link, Loader2, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [urlInput, setUrlInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setIsUploading(true)

      // For now, we'll use a placeholder approach
      // In production, you'd upload to Cloudflare R2 or similar
      const reader = new FileReader()
      reader.onload = () => {
        onChange(reader.result as string)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    },
    [onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput("")
    }
  }

  if (value) {
    return (
      <div className="relative">
        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
          <Image src={value || "/placeholder.svg"} alt="Featured image" fill className="object-cover" />
        </div>
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Tabs defaultValue="upload">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="url">URL</TabsTrigger>
      </TabsList>
      <TabsContent value="upload" className="mt-4">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-colors
            ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
          `}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{isDragActive ? "Drop image here" : "Drag & drop or click"}</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="url" className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image-url">Image URL</Label>
          <div className="flex gap-2">
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
              <Link className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center h-24 rounded-lg border border-dashed">
          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
        </div>
      </TabsContent>
    </Tabs>
  )
}
