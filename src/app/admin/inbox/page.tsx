import InboxClient from "@/components/admin/inbox-client";
import { getEmails } from "@/lib/emails";

export default async function InboxPage() {
  // ✅ getEmails() se hamesha ek object aata hai { data, totalPages }
  const { data: emails = [], totalPages = 0 } = await getEmails({ page: 1, perPage: 10 });

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* ✅ Array guard laga diya (emails ?? []), null/undefined error nahi aayega */}
      <InboxClient initialEmails={Array.isArray(emails) ? emails : []} />

      {/* ⚡ OPTIONAL: Agar future me pagination lagani ho */}
      {/* <PaginationControls
        currentPage={1}
        totalPages={totalPages}
        basePath="/admin/inbox"
      /> */}
    </div>
  );
}