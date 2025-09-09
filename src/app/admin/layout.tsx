import AdminLayoutClient from '@/components/layout/admin-layout-client';
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
    <AdminLayoutClient emailCount={emailCount} settings={settings}>
      {children}
    </AdminLayoutClient>
  );
}
