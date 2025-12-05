import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PageEditor } from "@/components/admin/page-editor"

interface PageEditPageProps {
    params: Promise<{ id: string }>
}

export default async function PageEditPage({ params }: PageEditPageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: page } = await supabase
        .from("page_content")
        .select("*")
        .eq("id", id)
        .single()

    if (!page) {
        notFound()
    }

    return (
        <PageEditor
            pageId={page.id}
            pageName={page.page_name}
            initialContent={page.content}
        />
    )
}
