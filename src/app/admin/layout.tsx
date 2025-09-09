import AdminSidebar from '@/components/layout/admin-sidebar';
import { getUnreadEmailCount } from '@/lib/emails';
import { getSiteSettings } from '@/lib/site-settings';

function AdminSidebarWrapper({ children }: { children: React.ReactNode }) {
    return <div className="flex min-h-screen">{children}</div>;
}


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const emailCount = await getUnreadEmailCount();
  const settings = await getSiteSettings();

  return (
    <AdminSidebarWrapper>
      <AdminSidebar emailCount={emailCount} settings={settings} />
      <main className="flex-1 p-8 bg-muted/40">{children}</main>
    </AdminSidebarWrapper>
  );
}
