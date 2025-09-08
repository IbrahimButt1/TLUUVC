import InboxClient from "@/components/admin/inbox-client";
import { getEmails } from "@/lib/emails";
import { Card } from "@/components/ui/card";

export default async function InboxPage() {
    const initialEmails = await getEmails();

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-3xl font-bold mb-6">Email Inbox</h1>
            <div className="flex-grow">
              <InboxClient initialEmails={initialEmails} />
            </div>
        </div>
    );
}
