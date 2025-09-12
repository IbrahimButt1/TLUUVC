'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, Plane, Inbox, Trash2, Home, Info, Lightbulb, MessageSquareQuote, Image as ImageIcon, Settings, Palette, KeyRound, ChevronDown, User, BookUser, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { SiteSettings } from '@/lib/site-settings';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/hero', label: 'Hero Images', icon: ImageIcon },
  { href: '/admin/about', label: 'About', icon: Info },
  { href: '/admin/inbox', label: 'Inbox', icon: Inbox },
  { href: '/admin/manifest', label: 'Manifest', icon: BookUser },
  { href: '/admin/client-balances', label: 'Client Balances', icon: BookUser },
];

const maintenanceLinks = [
  { href: '/admin/inbox/trash', label: 'Trash', icon: Trash2 },
  { href: '/admin/backup', label: 'Backup & Restore', icon: History },
];


const settingsLink = { href: '/admin/settings', label: 'Site Settings', icon: Settings };


export default function AdminSidebar({ emailCount, settings }: { emailCount: number, settings: SiteSettings }) {
  const pathname = usePathname();

  const isSettingsActive = pathname.startsWith('/admin/settings');

  return (
    <aside className="w-64 bg-background border-r flex flex-col">
      <Link href="/" className="flex items-center gap-2 h-16 border-b px-4 text-foreground hover:bg-muted transition-colors shrink-0">
        <Image src={settings.logo} alt="Company Logo" width={38} height={38} className="object-contain rounded-md" data-ai-hint="logo" />
        <span className="font-bold text-sm">THE LUU VISA CONSULTANT</span>
      </Link>

      <div className="flex-grow overflow-y-auto">
        <nav className="flex flex-col p-4 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground px-3 pt-2 pb-1">Admin</p>
          {navLinks.map((link) => {
              const isActive = (pathname === link.href) || (pathname.startsWith(link.href) && link.href !== '/admin');
              return (
                  <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                      'flex items-center justify-between gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted',
                      isActive && 'bg-muted text-foreground'
                      )}
                  >
                      <div className="flex items-center gap-3">
                      <link.icon className="h-4 w-4" />
                      {link.label}
                      </div>
                      {link.href === '/admin/inbox' && emailCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground">
                          {emailCount}
                      </Badge>
                      )}
                  </Link>
              )
          })}
          
          <p className="text-xs font-semibold text-muted-foreground px-3 pt-4 pb-1">Configuration</p>
           <Link
                href={settingsLink.href}
                className={cn(
                'flex items-center justify-between gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted',
                isSettingsActive && 'bg-muted text-foreground'
                )}
            >
                <div className="flex items-center gap-3">
                <settingsLink.icon className="h-4 w-4" />
                {settingsLink.label}
                </div>
            </Link>
             {maintenanceLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                  <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                      'flex items-center justify-between gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted',
                      isActive && 'bg-muted text-foreground'
                      )}
                  >
                      <div className="flex items-center gap-3">
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </div>
                  </Link>
              )
          })}
        </nav>
      </div>

       <Link href="/admin/settings?tab=profile" className="block mt-auto p-4 border-t hover:bg-muted transition-colors">
          <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                  <AvatarImage src={settings.avatar || "https://picsum.photos/100"} alt="Admin Avatar" data-ai-hint="person portrait" />
                  <AvatarFallback>
                      <User className="h-5 w-5" />
                  </AvatarFallback>
              </Avatar>
              <div>
                  <p className="text-sm font-semibold">{settings.username}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
          </div>
      </Link>
    </aside>
  );
}
