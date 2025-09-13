
import { getLogEntries } from "@/lib/logs";
import LogsClient from "@/components/admin/logs-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function LogsPage() {
    const initialLogs = await getLogEntries();

    return (
        <div className="space-y-6">
           <LogsClient initialLogs={initialLogs} />
        </div>
    );
}
