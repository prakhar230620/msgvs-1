import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { generateOrganizationSchema } from "@/lib/utils/seo"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }
  return `https://${url}`
}

export const metadata: Metadata = {
  title: {
    default: "Maa Santoshi Gramin Vikas Samiti - Empowering Communities",
    template: "%s | Maa Santoshi Gramin Vikas Samiti",
  },
  description:
    "We work tirelessly to create sustainable change in rural communities through education, healthcare, and economic empowerment.",
  keywords: [
    "NGO",
    "nonprofit",
    "charity",
    "community development",
    "education",
    "healthcare",
    "empowerment",
    "rural development",
    "India",
  ],
  authors: [{ name: "Maa Santoshi Gramin Vikas Samiti" }],
  creator: "Maa Santoshi Gramin Vikas Samiti",
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Maa Santoshi Gramin Vikas Samiti",
    title: "Maa Santoshi Gramin Vikas Samiti - Empowering Communities",
    description:
      "We work tirelessly to create sustainable change in rural communities through education, healthcare, and economic empowerment.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maa Santoshi Gramin Vikas Samiti - Empowering Communities",
    description:
      "We work tirelessly to create sustainable change in rural communities through education, healthcare, and economic empowerment.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema()),
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
