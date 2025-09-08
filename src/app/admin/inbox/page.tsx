import InboxClient from "@/components/admin/inbox-client";
import { getEmails } from "@/lib/emails";

export default async function InboxPage() {
    const initialEmails = await getEmails();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Email Inbox</h1>
            <InboxClient initialEmails={initialEmails} />
        </div>
    );
}
