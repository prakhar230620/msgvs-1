import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldX } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="h-7 w-7 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight">Access Denied</CardTitle>
            <CardDescription className="mt-2">
              You do not have permission to access the admin panel. Please contact the administrator if you believe this
              is an error.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
