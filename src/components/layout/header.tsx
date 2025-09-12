'use client';

import { Menu, X, User } from "lucide-react";
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
    <header className="w-full bg-background/95 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <a href="/" className="relative group p-1">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Image
              src={settings.logo}
              alt="Company Logo"
              width={270}
              height={68}
              className="object-contain rounded-lg h-auto w-auto max-h-[60px] relative z-10"
              data-ai-hint="logo"
            />
          </a>

          {/* Navigation (Desktop) */}
          <NavLinks />
        </div>

        {/* Right Side: CTA and Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button asChild className="hidden md:inline-flex" variant="ghost">
            <a href="/login">
              <User className="h-5 w-5" />
              <span>Admin Login</span>
            </a>
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
                    width={270}
                    height={68}
                    className="object-contain rounded-lg h-auto w-auto max-h-[60px]"
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
                  <a href="/login">Sign In</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
