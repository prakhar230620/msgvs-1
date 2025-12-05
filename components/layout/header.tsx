"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Menu, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blogs", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
]

const NGO_NAME = "Maa Santoshi Gramin Vikas Samiti"

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-28 md:h-32">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-[80px] w-[80px] md:h-[100px] md:w-[100px] items-center justify-center rounded-full overflow-hidden transition-transform group-hover:scale-105 border-2 border-primary/20">
              <Image
                src="/images/whatsapp-20image-202025-11-30-20at-207.jpeg"
                alt="Maa Santoshi Gramin Vikas Samiti Logo"
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-lg md:text-xl font-semibold tracking-tight text-foreground leading-tight block">
                {NGO_NAME}
              </span>
              <span className="text-xs font-medium text-foreground/80">Serving Communities Since 2009</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-full transition-colors",
                  pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/contact#contact-form">Get Involved</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <div className="sr-only">
                <SheetTitle>Mobile Menu</SheetTitle>
                <SheetDescription>Navigation links for mobile devices</SheetDescription>
              </div>
              <div className="flex flex-col gap-2 mt-8">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                  <Image
                    src="/images/whatsapp-20image-202025-11-30-20at-207.jpeg"
                    alt="Logo"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <span className="font-serif font-semibold text-sm">{NGO_NAME}</span>
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors py-3 px-4 rounded-lg border border-transparent hover:bg-muted hover:border-border",
                      pathname === item.href ? "text-primary bg-primary/5 border-primary/10" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="flex items-center justify-between py-3 px-4 mt-2 rounded-lg border border-border">
                  <span className="font-medium">Theme</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    className="rounded-full"
                  >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </div>

                <Button asChild className="mt-4 rounded-full w-full">
                  <Link href="/contact#contact-form" onClick={() => setIsOpen(false)}>
                    Get Involved
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </motion.header>
  )
}
