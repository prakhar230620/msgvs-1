"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"

interface ContactInfoProps {
  email?: string
  phone?: string
  address?: string
  hours?: string
}

export function ContactInfo({
  email = "vidhyachoure17@gmail.com",
  phone = "+91 9131530963",
  address = "Vidhya Choure, 38. Nutan Nagar, Ward Number 05, Gali Number 05. Pithampur, PO Pithampur, DIST: Dhar Madhya Pradesh-454775",
  hours = "Monday - Saturday: 9:00 AM - 6:00 PM",
}: ContactInfoProps) {
  const contactItems = [
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    { icon: Phone, label: "Phone", value: phone, href: `tel:${phone}` },
    { icon: MapPin, label: "Address", value: address },
    { icon: Clock, label: "Working Hours", value: hours },
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/share/1EKtc9snRU/", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Youtube, href: "https://youtube.com/@vidhyachoure4650?si=FBu-gKK-14fnzrZ3", label: "YouTube" },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {contactItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">{item.label}</h3>
              {item.href ? (
                <a href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                  {item.value}
                </a>
              ) : (
                <p className="text-muted-foreground">{item.value}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <h3 className="font-medium mb-4">Follow Us</h3>
        <div className="flex gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label={social.label}
            >
              <social.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden bg-muted aspect-video">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.335357864032!2d75.681551!3d22.597732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM1JzUxLjgiTiA3NcKwNDAnNTMuNiJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Maa Santoshi Gramin Vikas Samiti Location"
        />
      </div>
    </div>
  )
}
