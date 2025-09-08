'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, Plane, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/inbox', label: 'Inbox', icon: Inbox },
];

export default function AdminSidebar({ emailCount }: { emailCount: number }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-background border-r">
      <div className="flex items-center gap-2 h-14 border-b px-6">
        <Plane className="h-6 w-6 text-primary" />
        <span className="font-bold font-headline text-lg">LUU Admin</span>
      </div>
      <nav className="flex flex-col p-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center justify-between gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted',
              pathname === link.href && 'bg-muted text-foreground'
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
        ))}
      </nav>
    </aside>
  );
}
