import AdminSidebar from '@/components/layout/admin-sidebar';
import { getEmails } from '@/lib/emails';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const emails = await getEmails();
  const emailCount = emails.length;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar emailCount={emailCount} />
      <main className="flex-1 p-8 bg-muted/40">{children}</main>
    </div>
  );
}
