import InboxClient from "@/components/admin/inbox-client";
import { getEmails } from "@/lib/emails";

export default async function InboxPage() {
  // ✅ Destructure properly: only array and totalPages
  const { data: emails, totalPages } = await getEmails({ page: 1, perPage: 10 });

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* ✅ Now only emails array is passed */}
      <InboxClient initialEmails={emails} />
      {/* Agar future me pagination add karna ho to yahan PaginationControls bhi daal sakte ho */}
    </div>
  );
}