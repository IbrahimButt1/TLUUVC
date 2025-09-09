'use client';

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#hero", label: "Home", id: "hero" },
  { href: "#services", label: "Services", id: "services" },
  { href: "#about", label: "About", id: "about" },
  { href: "#knowledge", label: "Knowledge Base", id: "knowledge" },
  { href: "#testimonials", label: "Testimonials", id: "testimonials" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export default function NavLinks() {
  const [activeSection, setActiveSection] = useState('hero');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      const visibleSection = entries.find((entry) => entry.isIntersecting)?.target;
      if (visibleSection) {
        setActiveSection(visibleSection.id);
      }
    }, { threshold: 0.2 });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      observer.current?.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.current?.unobserve(section);
      });
    };
  }, []);

  return (
    <nav className="hidden md:flex flex-1 items-center gap-6 text-sm">
      {navLinks.map((link) => (
        <a 
          key={link.href} 
          href={link.href} 
          className={cn(
            "nav-link text-muted-foreground hover:text-foreground transition-colors",
            activeSection === link.id && "active text-foreground"
          )}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
