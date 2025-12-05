"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"
import { NewsletterForm } from "@/components/newsletter/newsletter-form"

const NGO_NAME = "Maa Santoshi Gramin Vikas Samiti"

const footerLinks = {
  organization: [
    { href: "/about", label: "About Us" },
    { href: "/about#team", label: "Our Team" },
    { href: "/about#mission", label: "Mission & Vision" },
    { href: "/contact", label: "Contact" },
  ],
  resources: [
    { href: "/blogs", label: "Blog" },
    { href: "/gallery", label: "Gallery" },
    { href: "/blogs?category=stories", label: "Success Stories" },
    { href: "/blogs?category=news", label: "Latest News" },
  ],
  getInvolved: [
    { href: "/contact#contact-form", label: "Volunteer" },
    { href: "/contact#contact-form", label: "Donate" },
    { href: "/contact#contact-form", label: "Partner With Us" },
    { href: "/contact#contact-form", label: "Careers" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/share/1EKtc9snRU/", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/@vidhyachoure4650?si=FBu-gKK-14fnzrZ3", label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-serif font-semibold mb-3">Stay Connected</h3>
            <p className="text-background/70 mb-6">
              Subscribe to our newsletter for updates on our programs and impact stories.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm
                variant="inline"
                className="[&_input]:bg-background/10 [&_input]:border-background/20 [&_input]:text-background [&_input]:placeholder:text-background/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full overflow-hidden border border-background/20">
                <Image
                  src="/images/whatsapp-20image-202025-11-30-20at-207.jpeg"
                  alt={NGO_NAME}
                  width={64}
                  height={64}
                  className="object-cover bg-primary rounded-full"
                />
              </div>
              <span className="font-serif text-lg font-semibold">{NGO_NAME}</span>
            </Link>
            <p className="text-background/70 mb-6 max-w-sm">
              Empowering rural communities through education, healthcare, and sustainable development programs that
              create lasting change.
            </p>
            <div className="space-y-3 text-sm text-background/70">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Vidhya Choure, 38. Nutan Nagar, Ward Number 05, Gali Number 05. Pithampur, PO Pithampur, DIST: Dhar Madhya Pradesh-454775</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+91 9131530963</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0" />
                <span>vidhyachoure17@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold mb-4">Organization</h4>
            <ul className="space-y-3">
              {footerLinks.organization.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Get Involved</h4>
            <ul className="space-y-3">
              {footerLinks.getInvolved.map((link, i) => (
                <li key={link.href + i}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/60">
              © {new Date().getFullYear()} {NGO_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/60 hover:text-background transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
