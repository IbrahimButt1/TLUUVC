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
          className={cn(
            "relative font-medium text-foreground/80 transition-colors hover:text-primary",
            "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          )}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
