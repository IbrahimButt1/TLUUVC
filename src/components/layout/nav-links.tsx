'use client';
import React from 'react';
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#hero", label: "Home", id: "hero" },
  { href: "#services", label: "Services", id: "services" },
  { href: "#about", label: "About", id: "about" },
  { href: "#knowledge", label: "Knowledge Base", id: "knowledge" },
  { href: "#testimonials", label: "Testimonials", id: "testimonials" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export default function NavLinks({ className }: { className?: string }) {

  return (
    <nav className={cn("hidden md:flex items-center gap-6 text-sm", className)}>
      {navLinks.map((link) => (
        <a 
          key={link.href} 
          href={link.href}
          className="text-foreground/80 hover:text-primary transition-colors font-medium"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
