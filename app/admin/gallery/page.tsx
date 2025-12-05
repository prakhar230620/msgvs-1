import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GalleryManager } from "@/components/admin/gallery-manager"

export default async function AdminGalleryPage() {
  const supabase = await createClient()

  const { data: images } = await supabase.from("gallery").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
        <p className="text-muted-foreground">Manage your gallery images.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
          <CardDescription>Upload, edit, and organize gallery images.</CardDescription>
        </CardHeader>
        <CardContent>
          <GalleryManager images={images || []} />
        </CardContent>
      </Card>
    </div>
  )
}
