import AdminSidebar from '@/components/layout/admin-sidebar';
import { getUnreadEmailCount } from '@/lib/emails';
import { getSiteSettings } from '@/lib/site-settings';


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const emailCount = await getUnreadEmailCount();
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar emailCount={emailCount} settings={settings} />
      <main className="flex-1 p-8 bg-muted/40">{children}</main>
    </div>
  );
}
