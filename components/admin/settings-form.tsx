"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Save } from "lucide-react"

interface SiteSettings {
  id: string
  site_name: string
  site_description: string
  site_logo: string | null
  contact_email: string
  contact_phone: string | null
  contact_address: string | null
  social_facebook: string | null
  social_twitter: string | null
  social_instagram: string | null
  social_linkedin: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
}

interface SettingsFormProps {
  settings: SiteSettings | null
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [formData, setFormData] = useState<Partial<SiteSettings>>(
    settings || {
      site_name: "",
      site_description: "",
      site_logo: "",
      contact_email: "",
      contact_phone: "",
      contact_address: "",
      social_facebook: "",
      social_twitter: "",
      social_instagram: "",
      social_linkedin: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
    },
  )
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = settings
      ? await supabase.from("site_settings").update(formData).eq("id", settings.id)
      : await supabase.from("site_settings").insert(formData)

    setIsLoading(false)

    if (error) {
      toast.error("Failed to save settings")
    } else {
      toast.success("Settings saved successfully")
      router.refresh()
    }
  }

  const updateField = (field: keyof SiteSettings, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4 mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="site_name">Site Name</Label>
            <Input
              id="site_name"
              value={formData.site_name || ""}
              onChange={(e) => updateField("site_name", e.target.value)}
              placeholder="Your NGO Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site_logo">Logo URL</Label>
            <Input
              id="site_logo"
              value={formData.site_logo || ""}
              onChange={(e) => updateField("site_logo", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="site_description">Site Description</Label>
          <Textarea
            id="site_description"
            value={formData.site_description || ""}
            onChange={(e) => updateField("site_description", e.target.value)}
            placeholder="Brief description of your organization..."
            rows={3}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="social_facebook">Facebook URL</Label>
            <Input
              id="social_facebook"
              value={formData.social_facebook || ""}
              onChange={(e) => updateField("social_facebook", e.target.value)}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="social_twitter">Twitter URL</Label>
            <Input
              id="social_twitter"
              value={formData.social_twitter || ""}
              onChange={(e) => updateField("social_twitter", e.target.value)}
              placeholder="https://twitter.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="social_instagram">Instagram URL</Label>
            <Input
              id="social_instagram"
              value={formData.social_instagram || ""}
              onChange={(e) => updateField("social_instagram", e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="social_linkedin">LinkedIn URL</Label>
            <Input
              id="social_linkedin"
              value={formData.social_linkedin || ""}
              onChange={(e) => updateField("social_linkedin", e.target.value)}
              placeholder="https://linkedin.com/..."
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="contact" className="space-y-4 mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email Address</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email || ""}
              onChange={(e) => updateField("contact_email", e.target.value)}
              placeholder="contact@yourorg.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">Phone Number</Label>
            <Input
              id="contact_phone"
              value={formData.contact_phone || ""}
              onChange={(e) => updateField("contact_phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_address">Address</Label>
          <Textarea
            id="contact_address"
            value={formData.contact_address || ""}
            onChange={(e) => updateField("contact_address", e.target.value)}
            placeholder="Your full address..."
            rows={3}
          />
        </div>
      </TabsContent>

      <TabsContent value="seo" className="space-y-4 mt-6">
        <div className="space-y-2">
          <Label htmlFor="meta_title">Meta Title</Label>
          <Input
            id="meta_title"
            value={formData.meta_title || ""}
            onChange={(e) => updateField("meta_title", e.target.value)}
            placeholder="SEO title for search engines (50-60 characters)"
            maxLength={60}
          />
          <p className="text-xs text-muted-foreground">{(formData.meta_title || "").length}/60 characters</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea
            id="meta_description"
            value={formData.meta_description || ""}
            onChange={(e) => updateField("meta_description", e.target.value)}
            placeholder="SEO description for search engines (150-160 characters)"
            rows={3}
            maxLength={160}
          />
          <p className="text-xs text-muted-foreground">{(formData.meta_description || "").length}/160 characters</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="meta_keywords">Meta Keywords</Label>
          <Input
            id="meta_keywords"
            value={formData.meta_keywords || ""}
            onChange={(e) => updateField("meta_keywords", e.target.value)}
            placeholder="keyword1, keyword2, keyword3..."
          />
          <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
        </div>
      </TabsContent>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </Tabs>
  )
}
