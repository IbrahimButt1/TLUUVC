import InboxClient from "@/components/admin/inbox-client";
import { getEmails } from "@/lib/emails";
import PaginationControls from "@/components/admin/pagination-controls";

// Server Component (safe with Next.js prerender)
export default async function InboxPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // ✅ Page param from URL (?page=2 etc.)
  const currentPage = Number(searchParams.page) || 1;
  const perPage = 10; // emails per page (set as you want)

  // ✅ Total emails from DB
  const initialEmails = await getEmails({ page: currentPage, perPage });
  const totalPages = initialEmails.totalPages; // make sure your getEmails returns totalPages count

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* ✅ List/Inbox */}
      <InboxClient initialEmails={initialEmails.data} />

      {/* ✅ Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/admin/emails"
        query={searchParams} // safe server-side
      />
    </div>
  );
}