
import { getLogEntries } from "@/lib/logs";
import LogsClient from "@/components/admin/logs-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function LogsPage() {
    const initialLogs = await getLogEntries();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>System Activity Logs</CardTitle>
                    <CardDescription>A record of all significant actions performed in the admin panel.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LogsClient initialLogs={initialLogs} />
                </CardContent>
            </Card>
        </div>
    );
}
