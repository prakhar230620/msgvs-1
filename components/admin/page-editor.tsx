"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Loader2, Save, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ImageUploader } from "@/components/admin/image-uploader"
import { defaultTestimonials } from "@/components/sections/testimonials-section"
import { defaultMilestones } from "@/components/about/about-timeline"
import { defaultTeam } from "@/components/about/about-team"

interface PageEditorProps {
    pageId: string
    pageName: string
    initialContent: any
}

export function PageEditor({ pageId, pageName, initialContent }: PageEditorProps) {
    const router = useRouter()
    const [content, setContent] = useState<any>(initialContent || {})
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState("hero")

    // Ensure content structure exists
    useEffect(() => {
        if (!content.hero) setContent((prev: any) => ({ ...prev, hero: {} }))
        if (!content.mission) setContent((prev: any) => ({ ...prev, mission: {} }))
        if (!content.stats) setContent((prev: any) => ({ ...prev, stats: [] }))
        if (!content.testimonials) setContent((prev: any) => ({ ...prev, testimonials: [] }))
    }, [])

    const handleSave = async () => {
        try {
            setIsSaving(true)

            const supabase = createClient()
            const { error } = await supabase
                .from("page_content")
                .update({
                    content: content,
                    updated_at: new Date().toISOString()
                })
                .eq("id", pageId)

            if (error) throw error

            toast.success("Page content updated successfully")
            router.refresh()
        } catch (error) {
            console.error("Error updating page:", error)
            toast.error("Failed to update page content")
        } finally {
            setIsSaving(false)
        }
    }

    const updateHero = (field: string, value: string) => {
        setContent((prev: any) => ({
            ...prev,
            hero: { ...prev.hero, [field]: value }
        }))
    }

    const updateMission = (field: string, value: string) => {
        setContent((prev: any) => ({
            ...prev,
            mission: { ...prev.mission, [field]: value }
        }))
    }

    const updateStat = (index: number, field: string, value: string) => {
        const newStats = [...(content.stats || [])]
        newStats[index] = { ...newStats[index], [field]: value }
        setContent((prev: any) => ({ ...prev, stats: newStats }))
    }

    const addStat = () => {
        setContent((prev: any) => ({
            ...prev,
            stats: [...(prev.stats || []), { label: "New Stat", value: "0" }]
        }))
    }

    const removeStat = (index: number) => {
        const newStats = [...(content.stats || [])]
        newStats.splice(index, 1)
        setContent((prev: any) => ({ ...prev, stats: newStats }))
    }

    const updateTestimonial = (index: number, field: string, value: string) => {
        const newTestimonials = [...(content.testimonials || [])]
        newTestimonials[index] = { ...newTestimonials[index], [field]: value }
        setContent((prev: any) => ({ ...prev, testimonials: newTestimonials }))
    }

    const addTestimonial = () => {
        setContent((prev: any) => ({
            ...prev,
            testimonials: [...(prev.testimonials || []), {
                author: "New Author",
                role: "Role",
                location: "Location",
                quote: "Quote here...",
                image: ""
            }]
        }))
    }

    const removeTestimonial = (index: number) => {
        const newTestimonials = [...(content.testimonials || [])]
        newTestimonials.splice(index, 1)
        setContent((prev: any) => ({ ...prev, testimonials: newTestimonials }))
    }

    const loadDefaultTestimonials = () => {
        setContent((prev: any) => ({
            ...prev,
            testimonials: defaultTestimonials
        }))
    }

    // Render specific editor based on page name
    const normalizedPageName = pageName?.toLowerCase().trim()
    if (normalizedPageName === 'home') {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight capitalize">Edit Home Page</h1>
                            <p className="text-sm text-muted-foreground">
                                Update the content of your home page sections.
                            </p>
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="hero">Hero Section</TabsTrigger>
                        <TabsTrigger value="stats">Statistics</TabsTrigger>
                        <TabsTrigger value="mission">Mission</TabsTrigger>
                        <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                        <TabsTrigger value="json">Advanced (JSON)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="hero">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hero Section</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Main Title</Label>
                                    <Input
                                        value={content.hero?.title || ""}
                                        onChange={(e) => updateHero("title", e.target.value)}
                                        placeholder="Empowering Communities..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Subtitle</Label>
                                    <Textarea
                                        value={content.hero?.subtitle || ""}
                                        onChange={(e) => updateHero("subtitle", e.target.value)}
                                        placeholder="We work tirelessly..."
                                        className="h-24"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>CTA Button Text</Label>
                                        <Input
                                            value={content.hero?.ctaText || ""}
                                            onChange={(e) => updateHero("ctaText", e.target.value)}
                                            placeholder="Learn More"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CTA Link</Label>
                                        <Input
                                            value={content.hero?.ctaLink || ""}
                                            onChange={(e) => updateHero("ctaLink", e.target.value)}
                                            placeholder="/about"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Background Image</Label>
                                    <ImageUploader
                                        value={content.hero?.backgroundImage || ""}
                                        onChange={(url) => updateHero("backgroundImage", url)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="stats">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Impact Statistics</CardTitle>
                                <Button size="sm" variant="outline" onClick={addStat}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Stat
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {content.stats?.map((stat: any, index: number) => (
                                    <div key={index} className="flex gap-4 items-end border p-4 rounded-lg">
                                        <div className="flex-1 space-y-2">
                                            <Label>Value</Label>
                                            <Input
                                                value={stat.value}
                                                onChange={(e) => updateStat(index, "value", e.target.value)}
                                                placeholder="150+"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <Label>Label</Label>
                                            <Input
                                                value={stat.label}
                                                onChange={(e) => updateStat(index, "label", e.target.value)}
                                                placeholder="Communities Served"
                                            />
                                        </div>
                                        <Button variant="destructive" size="icon" onClick={() => removeStat(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {(!content.stats || content.stats.length === 0) && (
                                    <p className="text-sm text-muted-foreground text-center py-4">No statistics added yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="mission">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mission Section</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Section Title</Label>
                                    <Input
                                        value={content.mission?.title || ""}
                                        onChange={(e) => updateMission("title", e.target.value)}
                                        placeholder="Our Mission"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={content.mission?.description || ""}
                                        onChange={(e) => updateMission("description", e.target.value)}
                                        placeholder="To empower underserved communities..."
                                        className="h-24"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>


                    <TabsContent value="testimonials">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Testimonials</CardTitle>
                                <div className="flex gap-2">
                                    {(!content.testimonials || content.testimonials.length === 0) && (
                                        <Button size="sm" variant="outline" onClick={loadDefaultTestimonials}>
                                            Load Samples
                                        </Button>
                                    )}
                                    <Button size="sm" variant="outline" onClick={addTestimonial}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Testimonial
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {content.testimonials?.map((testimonial: any, index: number) => (
                                    <div key={index} className="border p-4 rounded-lg space-y-4 relative">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() => removeTestimonial(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Author</Label>
                                                <Input
                                                    value={testimonial.author}
                                                    onChange={(e) => updateTestimonial(index, "author", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Role</Label>
                                                <Input
                                                    value={testimonial.role}
                                                    onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Location</Label>
                                                <Input
                                                    value={testimonial.location}
                                                    onChange={(e) => updateTestimonial(index, "location", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Quote</Label>
                                            <Textarea
                                                value={testimonial.quote}
                                                onChange={(e) => updateTestimonial(index, "quote", e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Author Image</Label>
                                            <ImageUploader
                                                value={testimonial.image || ""}
                                                onChange={(url) => updateTestimonial(index, "image", url)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!content.testimonials || content.testimonials.length === 0) && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No testimonials added yet. The default testimonials will be shown on the site.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="json">
                        <Card>
                            <CardHeader>
                                <CardTitle>Raw JSON Editor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label>JSON Data</Label>
                                    <Textarea
                                        value={JSON.stringify(content, null, 2)}
                                        onChange={(e) => {
                                            try {
                                                setContent(JSON.parse(e.target.value))
                                            } catch (err) {
                                                // Allow typing invalid JSON temporarily
                                            }
                                        }}
                                        className="font-mono min-h-[400px] text-sm"
                                        spellCheck={false}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        )
    }

    if (normalizedPageName === 'about') {
        const updateValues = (index: number, field: string, value: string) => {
            const newValues = [...(content.values || [])]
            newValues[index] = { ...newValues[index], [field]: value }
            setContent((prev: any) => ({ ...prev, values: newValues }))
        }

        const addValue = () => {
            setContent((prev: any) => ({
                ...prev,
                values: [...(prev.values || []), { title: "New Value", description: "Description..." }]
            }))
        }

        const removeValue = (index: number) => {
            const newValues = [...(content.values || [])]
            newValues.splice(index, 1)
            setContent((prev: any) => ({ ...prev, values: newValues }))
        }

        const updateMilestone = (index: number, field: string, value: string) => {
            const newMilestones = [...(content.timeline || [])]
            newMilestones[index] = { ...newMilestones[index], [field]: value }
            setContent((prev: any) => ({ ...prev, timeline: newMilestones }))
        }

        const addMilestone = () => {
            setContent((prev: any) => ({
                ...prev,
                timeline: [...(prev.timeline || []), { year: "2024", title: "New Milestone", description: "Description..." }]
            }))
        }

        const removeMilestone = (index: number) => {
            const newMilestones = [...(content.timeline || [])]
            newMilestones.splice(index, 1)
            setContent((prev: any) => ({ ...prev, timeline: newMilestones }))
        }

        const loadDefaultMilestones = () => {
            setContent((prev: any) => ({
                ...prev,
                timeline: defaultMilestones
            }))
        }

        const loadDefaultTeam = () => {
            setContent((prev: any) => ({
                ...prev,
                team: defaultTeam
            }))
        }

        const updateTeamMember = (index: number, field: string, value: string) => {
            const newTeam = [...(content.team || [])]
            newTeam[index] = { ...newTeam[index], [field]: value }
            setContent((prev: any) => ({ ...prev, team: newTeam }))
        }

        const addTeamMember = () => {
            setContent((prev: any) => ({
                ...prev,
                team: [...(prev.team || []), { name: "New Member", role: "Role", bio: "Bio...", image: "" }]
            }))
        }

        const removeTeamMember = (index: number) => {
            const newTeam = [...(content.team || [])]
            newTeam.splice(index, 1)
            setContent((prev: any) => ({ ...prev, team: newTeam }))
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight capitalize">Edit About Page</h1>
                            <p className="text-sm text-muted-foreground">
                                Update the content of your about page.
                            </p>
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="hero">Hero</TabsTrigger>
                        <TabsTrigger value="values">Values</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                        <TabsTrigger value="team">Team</TabsTrigger>
                        <TabsTrigger value="json">Advanced (JSON)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="hero">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hero Section</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={content.title || ""}
                                        onChange={(e) => setContent({ ...content, title: e.target.value })}
                                        placeholder="About Our Organization"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>History/Story</Label>
                                    <Textarea
                                        value={content.history || ""}
                                        onChange={(e) => setContent({ ...content, history: e.target.value })}
                                        placeholder="Founded in..."
                                        className="h-24"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Vision</Label>
                                    <Textarea
                                        value={content.vision || ""}
                                        onChange={(e) => setContent({ ...content, vision: e.target.value })}
                                        placeholder="A world where..."
                                        className="h-24"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Stats Count</Label>
                                        <Input
                                            value={content.statsCount || ""}
                                            onChange={(e) => setContent({ ...content, statsCount: e.target.value })}
                                            placeholder="15+"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Stats Label</Label>
                                        <Input
                                            value={content.statsLabel || ""}
                                            onChange={(e) => setContent({ ...content, statsLabel: e.target.value })}
                                            placeholder="Years of Service"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Hero Image</Label>
                                    <ImageUploader
                                        value={content.image || ""}
                                        onChange={(url) => setContent({ ...content, image: url })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="values">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Core Values</CardTitle>
                                <Button size="sm" variant="outline" onClick={addValue}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Value
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {content.values?.map((val: any, index: number) => (
                                    <div key={index} className="border p-4 rounded-lg space-y-4 relative">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() => removeValue(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input
                                                value={val.title}
                                                onChange={(e) => updateValues(index, "title", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                value={val.description}
                                                onChange={(e) => updateValues(index, "description", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!content.values || content.values.length === 0) && (
                                    <p className="text-sm text-muted-foreground text-center py-4">No values added yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="timeline">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Timeline Milestones</CardTitle>
                                <div className="flex gap-2">
                                    {(!content.timeline || content.timeline.length === 0) && (
                                        <Button size="sm" variant="outline" onClick={loadDefaultMilestones}>
                                            Load Samples
                                        </Button>
                                    )}
                                    <Button size="sm" variant="outline" onClick={addMilestone}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Milestone
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {content.timeline?.map((milestone: any, index: number) => (
                                    <div key={index} className="border p-4 rounded-lg space-y-4 relative">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() => removeMilestone(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="col-span-1 space-y-2">
                                                <Label>Year</Label>
                                                <Input
                                                    value={milestone.year}
                                                    onChange={(e) => updateMilestone(index, "year", e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-3 space-y-2">
                                                <Label>Title</Label>
                                                <Input
                                                    value={milestone.title}
                                                    onChange={(e) => updateMilestone(index, "title", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                value={milestone.description}
                                                onChange={(e) => updateMilestone(index, "description", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!content.timeline || content.timeline.length === 0) && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No milestones added yet. Default milestones will be shown.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="team">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Team Members</CardTitle>
                                <div className="flex gap-2">
                                    {(!content.team || content.team.length === 0) && (
                                        <Button size="sm" variant="outline" onClick={loadDefaultTeam}>
                                            Load Samples
                                        </Button>
                                    )}
                                    <Button size="sm" variant="outline" onClick={addTeamMember}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Member
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {content.team?.map((member: any, index: number) => (
                                    <div key={index} className="border p-4 rounded-lg space-y-4 relative">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() => removeTeamMember(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Name</Label>
                                                <Input
                                                    value={member.name}
                                                    onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Role</Label>
                                                <Input
                                                    value={member.role}
                                                    onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Bio</Label>
                                            <Textarea
                                                value={member.bio}
                                                onChange={(e) => updateTeamMember(index, "bio", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Photo</Label>
                                            <ImageUploader
                                                value={member.image || ""}
                                                onChange={(url) => updateTeamMember(index, "image", url)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!content.team || content.team.length === 0) && (
                                    <p className="text-sm text-muted-foreground text-center py-4">No team members added yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="json">
                        <Card>
                            <CardHeader>
                                <CardTitle>Raw JSON Editor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label>JSON Data</Label>
                                    <Textarea
                                        value={JSON.stringify(content, null, 2)}
                                        onChange={(e) => {
                                            try {
                                                setContent(JSON.parse(e.target.value))
                                            } catch (err) {
                                                // Allow typing invalid JSON temporarily
                                            }
                                        }}
                                        className="font-mono min-h-[400px] text-sm"
                                        spellCheck={false}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        )
    }



    if (normalizedPageName === 'contact') {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight capitalize">Edit Contact Page</h1>
                            <p className="text-sm text-muted-foreground">
                                Update contact information and page details.
                            </p>
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="info">Contact Info</TabsTrigger>
                        <TabsTrigger value="json">Advanced (JSON)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>Page Header</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={content.title || ""}
                                        onChange={(e) => setContent({ ...content, title: e.target.value })}
                                        placeholder="Get in Touch"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Subtitle</Label>
                                    <Textarea
                                        value={content.subtitle || ""}
                                        onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                                        placeholder="We'd love to hear from you..."
                                        className="h-24"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="info">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        value={content.email || ""}
                                        onChange={(e) => setContent({ ...content, email: e.target.value })}
                                        placeholder="contact@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input
                                        value={content.phone || ""}
                                        onChange={(e) => setContent({ ...content, phone: e.target.value })}
                                        placeholder="+91 1234567890"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Address</Label>
                                    <Textarea
                                        value={content.address || ""}
                                        onChange={(e) => setContent({ ...content, address: e.target.value })}
                                        placeholder="123 Street Name..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Hours</Label>
                                    <Input
                                        value={content.hours || ""}
                                        onChange={(e) => setContent({ ...content, hours: e.target.value })}
                                        placeholder="Mon-Fri: 9am - 5pm"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="json">
                        <Card>
                            <CardHeader>
                                <CardTitle>Raw JSON Editor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label>JSON Data</Label>
                                    <Textarea
                                        value={JSON.stringify(content, null, 2)}
                                        onChange={(e) => {
                                            try {
                                                setContent(JSON.parse(e.target.value))
                                            } catch (err) {
                                                // Allow typing invalid JSON temporarily
                                            }
                                        }}
                                        className="font-mono min-h-[400px] text-sm"
                                        spellCheck={false}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        )
    }

    // Fallback for other pages (generic JSON editor)
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight capitalize">Edit {pageName} Page</h1>
                        <p className="text-sm text-muted-foreground">
                            Edit the content JSON structure directly.
                        </p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Content JSON</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="json-editor">JSON Data</Label>
                        <Textarea
                            id="json-editor"
                            value={JSON.stringify(content, null, 2)}
                            onChange={(e) => {
                                try {
                                    setContent(JSON.parse(e.target.value))
                                } catch (err) {
                                    // Allow typing invalid JSON temporarily
                                }
                            }}
                            className="font-mono min-h-[600px] text-sm"
                            spellCheck={false}
                        />
                        <p className="text-xs text-muted-foreground">
                            Be careful when editing the JSON structure. Ensure all keys match what the frontend expects.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
