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
  const [activeSection, setActiveSection] = useState<string>('hero');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRefs = useRef<Map<string, HTMLElement | null>>(new Map());

  useEffect(() => {
    const trackedSections = new Map<string, { isIntersecting: boolean; intersectionRatio: number }>();

    const updateActiveSection = () => {
        let maxRatio = -1;
        let mostVisibleSectionId = '';

        trackedSections.forEach((value, key) => {
            if (value.isIntersecting && value.intersectionRatio > maxRatio) {
                maxRatio = value.intersectionRatio;
                mostVisibleSectionId = key;
            }
        });

        if (mostVisibleSectionId) {
            setActiveSection(mostVisibleSectionId);
        }
    };


    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
            trackedSections.set(entry.target.id, {
                isIntersecting: entry.isIntersecting,
                intersectionRatio: entry.intersectionRatio,
            });
        });
        updateActiveSection();
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100), // Create an array of thresholds from 0.0 to 1.0
        rootMargin: "0px 0px -50% 0px"
      }
    );

    const currentObserver = observerRef.current;

    navLinks.forEach((link) => {
      const element = document.getElementById(link.id);
      if (element) {
        sectionRefs.current.set(link.id, element);
        currentObserver.observe(element);
      }
    });

    return () => {
      sectionRefs.current.forEach((element) => {
        if (element) {
          currentObserver.unobserve(element);
        }
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