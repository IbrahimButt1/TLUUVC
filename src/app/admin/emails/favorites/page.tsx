import InboxClient from "@/components/admin/inbox-client";
import { getFavoritedEmails } from "@/lib/emails";

export default async function FavoritesPage() {
    const initialEmails = await getFavoritedEmails();

    return (
        <div className="flex flex-col h-full space-y-6">
            <h1 className="text-3xl font-bold">Favorite Emails</h1>
            <div className="flex-grow">
              <InboxClient initialEmails={initialEmails} />
            </div>
        </div>
    );
}
