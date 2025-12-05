import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { decompressText } from "@/lib/utils/compression"

export default async function ContactsPage() {
    const supabase = await createClient()

    const { data: submissions, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching contact submissions:", error)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Contact Submissions</h1>
                    <p className="text-sm text-muted-foreground">
                        View and manage messages from the contact form.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Message</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions?.map((submission) => (
                                <TableRow key={submission.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {submission.created_at ? format(new Date(submission.created_at), "MMM d, yyyy") : "N/A"}
                                    </TableCell>
                                    <TableCell className="font-medium">{submission.name}</TableCell>
                                    <TableCell>{submission.email}</TableCell>
                                    <TableCell className="capitalize">
                                        {decompressText(submission.subject)?.replace(/-/g, " ") || submission.subject}
                                    </TableCell>
                                    <TableCell className="max-w-md truncate" title={decompressText(submission.message) || submission.message}>
                                        {decompressText(submission.message) || submission.message}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!submissions || submissions.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No messages found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
