'use client';

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { getSiteSettings } from "@/lib/site-settings";
import React, { useState, useEffect } from "react";
import NavLinks from "@/components/layout/nav-links";
import { cn } from "@/lib/utils";

export default function Header() {
  const [settings, setSettings] =
    useState<Awaited<ReturnType<typeof getSiteSettings>> | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  if (!settings) {
    return <header className="w-full h-20" />;
  }

  return (
    <header className="w-full bg-background/95 backdrop-blur-sm shadow-sm">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Image
              src={settings.logo}
              alt="Company Logo"
              width={120}
              height={30}
              className="object-contain rounded-lg"
              data-ai-hint="logo"
            />
          </a>

          {/* Navigation (Desktop) */}
          <NavLinks />
        </div>

        {/* Right Side: CTA and Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button asChild className="hidden md:inline-flex">
            <a href="/admin">Sign In</a>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader className="flex flex-row items-center justify-between">
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src={settings.logo}
                    alt="Company Logo"
                    width={120}
                    height={30}
                    className="object-contain rounded-lg"
                  />
                </SheetTitle>
                <SheetClose>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </SheetHeader>

              {/* Mobile Nav Links */}
              <div className="flex flex-col gap-6 pt-10">
                <a
                  href="#"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Home
                </a>
                <a
                  href="#services"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Services
                </a>
                <a
                  href="#about"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  About
                </a>
                <a
                  href="#knowledge"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Knowledge Base
                </a>
                <a
                  href="#testimonials"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Testimonials
                </a>
                <a
                  href="#contact"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Contact
                </a>

                <Button asChild className="mt-4">
                  <a href="/admin">Sign In</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
