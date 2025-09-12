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
    <nav className={cn("hidden md:flex items-center gap-8 text-base", className)}>
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="relative group font-medium text-foreground/80 transition-colors hover:text-primary"
        >
          {link.label}
          <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
        </a>
      ))}
    </nav>
  );
}
