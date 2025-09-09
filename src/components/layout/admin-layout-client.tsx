'use client';

import AdminSidebar from '@/components/layout/admin-sidebar';
import type { SiteSettings } from '@/lib/site-settings';

export default function AdminLayoutClient({
  emailCount,
  settings,
  children,
}: {
  emailCount: number;
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar emailCount={emailCount} settings={settings} />
      <main className="flex-1 p-8 bg-muted/40">{children}</main>
    </div>
  );
}
