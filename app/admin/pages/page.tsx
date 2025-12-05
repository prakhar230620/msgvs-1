import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Eye, FileText } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function PagesPage() {
    const supabase = await createClient()
    const { data: pages } = await supabase
        .from("page_content")
        .select("*")
        .order("page_name")

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
            </div>

            <div className="grid gap-4">
                {pages?.map((page) => (
                    <Card key={page.id}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg capitalize">{page.page_name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>/{page.page_name === 'home' ? '' : page.page_name}</span>
                                        <span>•</span>
                                        <span>Updated {new Date(page.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200">
                                    Published
                                </Badge>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={page.page_name === 'home' ? '/' : `/${page.page_name}`} target="_blank">
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/pages/${page.id}`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {(!pages || pages.length === 0) && (
                    <div className="text-center py-10 text-muted-foreground">
                        No pages found in database.
                    </div>
                )}
            </div>
        </div>
    )
}
