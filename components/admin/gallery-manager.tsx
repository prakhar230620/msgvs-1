"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { uploadBlogImage } from "@/lib/storage"
import { compressText, decompressText } from "@/lib/utils/compression"
import { Loader2, Upload, Plus, MoreHorizontal, Trash2, Edit, ImageIcon } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface GalleryImage {
  id: string
  title: string
  description: string | null
  image_url: string
  category: string
  created_at: string
}

interface GalleryManagerProps {
  images: GalleryImage[]
}

const categories = ["All", "Events", "Projects", "Community", "Team", "Impact"]

export function GalleryManager({ images }: GalleryManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filter, setFilter] = useState("All")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "Events",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const filteredImages = filter === "All" ? images : images.filter((img) => img.category === filter)

  const handleAdd = async () => {
    if (!formData.title) {
      toast.error("Title is required")
      return
    }

    if (!formData.image_url && !selectedFile) {
      toast.error("Image is required")
      return
    }

    setIsLoading(true)
    try {
      let finalImageUrl = formData.image_url

      if (selectedFile) {
        // Upload to GCS with compression
        finalImageUrl = await uploadBlogImage(selectedFile)
      }

      const supabase = createClient()

      const { error } = await supabase.from("gallery").insert({
        title: formData.title,
        description: formData.description ? compressText(formData.description) : null,
        image_url: finalImageUrl,
        category: formData.category,
      })

      if (error) throw error

      toast.success("Image added successfully")
      setFormData({ title: "", description: "", image_url: "", category: "Events" })
      setSelectedFile(null)
      setIsAddOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Gallery add error:", error)
      toast.error("Failed to add image")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedImage || !formData.title || !formData.image_url) return

    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("gallery")
      .update({
        title: formData.title,
        description: formData.description || null,
        image_url: formData.image_url,
        category: formData.category,
      })
      .eq("id", selectedImage.id)

    setIsLoading(false)

    if (error) {
      toast.error("Failed to update image")
    } else {
      toast.success("Image updated successfully")
      setIsEditOpen(false)
      setSelectedImage(null)
      router.refresh()
    }
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()

    const { error } = await supabase.from("gallery").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete image")
    } else {
      toast.success("Image deleted")
      router.refresh()
    }
  }

  const openEdit = (image: GalleryImage) => {
    setSelectedImage(image)
    setFormData({
      title: image.title,
      description: image.description ? (decompressText(image.description) || image.description) : "",
      image_url: image.image_url,
      category: image.category,
    })
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button suppressHydrationWarning>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Gallery Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Image title"
                />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex flex-col gap-2">
                  {selectedFile ? (
                    <div className="flex items-center gap-2 p-2 border rounded-md">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm truncate flex-1">{selectedFile.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-500">Click to upload</p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setSelectedFile(e.target.files[0])
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the image..."
                  rows={3}
                />
              </div>
              <Button onClick={handleAdd} disabled={isLoading} className="w-full">
                {isLoading ? "Adding..." : "Add Image"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No images in gallery yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <div key={image.id} className="group relative aspect-square rounded-lg overflow-hidden border">
              <Image
                src={image.image_url || "/placeholder.svg?height=300&width=300&query=gallery image"}
                alt={image.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" suppressHydrationWarning>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(image)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(image.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="text-white">
                  <p className="font-medium text-sm truncate">{image.title}</p>
                  <p className="text-xs text-white/70">{image.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Gallery Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image_url">Image URL</Label>
              <Input
                id="edit-image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <Button onClick={handleEdit} disabled={isLoading} className="w-full">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
