import BackupClient from "@/components/admin/backup-client";
import { getBackupData, restoreBackupData } from "@/lib/backup";

export default async function BackupPage() {

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Backup & Restore</h1>
            <BackupClient 
                getBackupData={getBackupData}
                restoreBackupData={restoreBackupData}
            />
        </div>
    );
}
