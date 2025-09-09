'use client';

import { Plane, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { getSiteSettings } from "@/lib/site-settings";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#", label: "Home", id: "hero" }, // Assuming hero section has an id="hero" or we treat top of page as home
  { href: "#services", label: "Services", id: "services" },
  { href: "#about", label: "About", id: "about" },
  { href: "#knowledge", label: "Knowledge Base", id: "knowledge" },
  { href: "#testimonials", label: "Testimonials", id: "testimonials" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export default function Header() {
  const [settings, setSettings] = useState<Awaited<ReturnType<typeof getSiteSettings>> | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  useEffect(() => {
    // Populate refs for each section
    navLinks.forEach(link => {
      // Home is a special case, we'll use a placeholder for it
      if (link.id !== 'hero') {
        sectionsRef.current[link.id] = document.getElementById(link.id);
      }
    });

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let currentSection = 'hero';

      navLinks.forEach(link => {
        const section = sectionsRef.current[link.id];
        if (section && scrollPosition >= section.offsetTop) {
          currentSection = link.id;
        }
      });
      
      // Handle hero section specifically - active when at the top
      if (window.scrollY < 200) {
        currentSection = 'hero';
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!settings) {
    return <header className="sticky top-0 z-50 w-full h-14" />;
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-6 flex items-center">
          <a href="#" className="flex items-center gap-2">
            <Image src={settings.logo} alt="Company Logo" width={32} height={32} className="rounded-full" data-ai-hint="logo" />
            <span className="font-bold font-headline text-lg">The LUU Visa Consultant</span>
          </a>
        </div>
        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              className={cn(
                "nav-link text-muted-foreground hover:text-foreground transition-colors",
                activeSection === link.id && 'nav-link-active'
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild className="hidden md:inline-flex">
            <a href="#contact">Get a Consultation</a>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 pt-10">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                ))}
                <Button asChild className="mt-4">
                  <a href="#contact">Get a Consultation</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
