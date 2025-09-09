'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, Plane, Inbox, Trash2, Home, Info, Lightbulb, MessageSquareQuote, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/hero', label: 'Hero Images', icon: ImageIcon },
  { href: '/admin/inbox', label: 'Inbox', icon: Inbox },
  { href: '/admin/inbox/trash', label: 'Trash', icon: Trash2 },
];

const clientNavLinks = [
    { href: '/#', label: 'Home', icon: Home },
    { href: '/#about', label: 'About', icon: Info },
    { href: '/#knowledge', label: 'Knowledge Base', icon: Lightbulb },
    { href: '/#testimonials', label: 'Testimonials', icon: MessageSquareQuote },
];

export default function AdminSidebar({ emailCount }: { emailCount: number }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-background border-r">
      <Link href="/" className="flex items-center gap-2 h-14 border-b px-6 text-foreground hover:bg-muted transition-colors">
        <Image src="https://picsum.photos/32/32" alt="Company Logo" width={24} height={24} className="rounded-full" data-ai-hint="logo" />
        <span className="font-bold font-headline text-lg">LUU Admin</span>
      </Link>
      <nav className="flex flex-col p-4">
        <p className="text-xs font-semibold text-muted-foreground px-3 pt-2 pb-1">Admin</p>
        {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href) && (link.href !== '/admin' || pathname === '/admin');
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
        <p className="text-xs font-semibold text-muted-foreground px-3 pt-4 pb-1">Client Site</p>
        {clientNavLinks.map((link) => {
            return (
                <Link
                    key={link.href}
                    href={link.href}
                    className='flex items-center justify-between gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted'
                >
                    <div className="flex items-center gap-3">
                        <link.icon className="h-4 w-4" />
                        {link.label}
                    </div>
                </Link>
            )
        })}
      </nav>
    </aside>
  );
}
