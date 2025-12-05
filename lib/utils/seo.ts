import type { Metadata } from "next"

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = "/og-image.jpg",
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
}: SEOProps): Metadata {
  const siteName = "Hope Foundation"
  const fullTitle = `${title} | ${siteName}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type,
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
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
  }
}

// Generate JSON-LD structured data for organization
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Hope Foundation",
    description: "Empowering communities through education, healthcare, and economic empowerment.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/logo.png`,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "customer service",
    },
  }
}

// Generate JSON-LD structured data for blog posts
export function generateArticleSchema(blog: {
  title: string
  description: string
  image?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.description,
    image: blog.image,
    author: {
      "@type": "Person",
      name: blog.author || "Hope Foundation",
    },
    publisher: {
      "@type": "Organization",
      name: "Hope Foundation",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/logo.png`,
      },
    },
    datePublished: blog.publishedTime,
    dateModified: blog.modifiedTime || blog.publishedTime,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blog.url,
    },
  }
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
