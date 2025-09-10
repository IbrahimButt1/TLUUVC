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
import NavLinks from "./nav-links";
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
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background shadow-md"
      )}
    >
      <div className="container flex h-20 items-center justify-between gap-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <Image
            src={settings.logo}
            alt="Company Logo"
            width={80}
            height={20}
            className="object-contain"
            data-ai-hint="logo"
          />
        </a>

        {/* Navigation + Buttons */}
        <div className="flex items-center gap-4">
          <NavLinks className="hidden md:flex" />

          <Button
            asChild
            className="hidden md:inline-flex"
            variant="secondary"
            size="sm"
          >
            <a href="#contact">Get a Consultation</a>
          </Button>

          {/* Mobile Menu */}
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
                    width={80}
                    height={20}
                    className="object-contain"
                  />
                </SheetTitle>
                <SheetClose>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </SheetHeader>
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
