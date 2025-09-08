import TrashClient from "@/components/admin/trash-client";
import { getTrashedEmails } from "@/lib/emails";

export default async function TrashPage() {
    const initialEmails = await getTrashedEmails();

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Trash</h1>
            </div>
            <div className="flex-grow">
              <TrashClient initialEmails={initialEmails} />
            </div>
        </div>
    );
}
