import InboxClient from "@/components/admin/inbox-client";
import { getEmails } from "@/lib/emails";

export default async function InboxPage() {
  try {
    const result = await getEmails({ page: 1, perPage: 10 });

    // ✅ Safe guards
    const emails = Array.isArray(result?.data) ? result.data : [];
    const totalPages = result?.totalPages ?? 0;

    return (
      <div className="flex flex-col h-full space-y-6">
        <InboxClient initialEmails={emails} />
        {/* future me pagination yahan add kar sakte ho using totalPages */}
      </div>
    );
  } catch (error) {
    console.error("Failed to load emails:", error);
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-600">Error loading inbox</h1>
      </div>
    );
  }
}