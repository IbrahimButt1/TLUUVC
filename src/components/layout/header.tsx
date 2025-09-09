'use client';

import { Plane, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { getSiteSettings } from "@/lib/site-settings";
import React, { useState, useEffect } from "react";
import NavLinks from "./nav-links";

export default function Header() {
  const [settings, setSettings] = useState<Awaited<ReturnType<typeof getSiteSettings>> | null>(null);
  
  useEffect(() => {
    getSiteSettings().then(setSettings);
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
        
        <NavLinks />

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
                <a href="#" className="text-lg font-medium text-foreground hover:text-primary transition-colors">Home</a>
                <a href="#services" className="text-lg font-medium text-foreground hover:text-primary transition-colors">Services</a>
                <a href="#about" className="text-lg font-medium text-foreground hover:text-primary transition-colors">About</a>
                <a href="#knowledge" className="text-lg font-medium text-foreground hover:text-primary transition-colors">Knowledge Base</a>
                <a href="#testimonials" className="text-lg font-medium text-foreground hover:text-primary transition-colors">Testimonials</a>
                <a href="#contact" className="text-lg font-medium text-foreground hover:text-primary transition-colors">Contact</a>

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
