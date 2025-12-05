"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Copy, Check, ImageIcon, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { uploadBlogImage } from "@/lib/storage"

export default function MediaPage() {
    const [images, setImages] = useState<{ name: string, url: string }[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedUrl, setUploadedUrl] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchImages = async () => {
        try {
            const res = await fetch("/api/upload/list")
            if (res.ok) {
                const data = await res.json()
                setImages(data.files || [])
            }
        } catch (error) {
            console.error("Failed to fetch images", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch on mount
    useState(() => {
        fetchImages()
    })

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const url = await uploadBlogImage(file)
            setUploadedUrl(url)
            toast.success("Image uploaded successfully!")
            fetchImages() // Refresh list
        } catch (error) {
            console.error("Upload failed:", error)
            toast.error("Failed to upload image")
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async (url: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return

        setIsDeleting(true)
        try {
            const response = await fetch("/api/upload/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            })

            if (!response.ok) throw new Error("Delete failed")

            toast.success("Image deleted successfully")
            if (uploadedUrl === url) setUploadedUrl("")
            fetchImages() // Refresh list
        } catch (error) {
            console.error("Delete error:", error)
            toast.error("Failed to delete image")
        } finally {
            setIsDeleting(false)
        }
    }

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url)
        toast.success("URL copied to clipboard")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upload New Image</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 space-y-4">
                        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-semibold text-lg">Click to upload</h3>
                            <p className="text-sm text-muted-foreground">
                                Supports JPG, PNG, WEBP (Max 5MB)
                            </p>
                        </div>
                        <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="file-upload"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                        <Button asChild disabled={isUploading}>
                            <Label htmlFor="file-upload" className="cursor-pointer">
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    "Select Image"
                                )}
                            </Label>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Images ({images.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : images.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No images found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map((file) => (
                                <div key={file.url} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
                                    <img
                                        src={file.url}
                                        alt={file.name}
                                        className="object-cover w-full h-full"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button size="icon" variant="secondary" onClick={() => copyToClipboard(file.url)} title="Copy URL">
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="destructive" onClick={() => handleDelete(file.url)} disabled={isDeleting} title="Delete">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 text-white text-xs truncate">
                                        {file.name.replace('images/', '')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
