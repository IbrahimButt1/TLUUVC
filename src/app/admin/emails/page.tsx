import InboxClient from "@/components/admin/inbox-client";
import { getEmails } from "@/lib/emails";
import { Card } from "@/components/ui/card";

export default async function InboxPage() {
    const initialEmails = await getEmails();

    return (
        <div className="flex flex-col h-full space-y-6">
            <InboxClient initialEmails={initialEmails} />
        </div>
    );
}
