'use client';
import React, { useState, useEffect, useRef } from 'react';
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
  const [activeSection, setActiveSection] = useState('hero');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      const visibleSections = entries.filter(entry => entry.isIntersecting);
      if (visibleSections.length > 0) {
        // Find the section with the largest visible area
        visibleSections.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        setActiveSection(visibleSections[0].target.id);
      }
    }, { 
      threshold: [0.25, 0.5, 0.75, 1], // More thresholds for better accuracy
      rootMargin: '-50% 0px -50% 0px'
    });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      if (observer.current) {
        observer.current.observe(section);
      }
    });

    return () => {
      sections.forEach(section => {
        if (observer.current) {
          observer.current.unobserve(section);
        }
      });
    };
  }, []);

  return (
    <nav className={cn("hidden md:flex flex-1 items-center gap-6 text-sm justify-center", className)}>
      {navLinks.map((link) => (
        <a 
          key={link.href} 
          href={link.href}
          data-active={activeSection === link.id}
          className="nav-link text-foreground/80 hover:text-primary transition-colors font-medium"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
