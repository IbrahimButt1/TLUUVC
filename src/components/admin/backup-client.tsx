'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BackupClientProps {
    getBackupData: () => Promise<string>;
    restoreBackupData: (backupContent: string) => Promise<{ success: boolean; error?: string }>;
}

export default function BackupClient({ getBackupData, restoreBackupData }: BackupClientProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleDownload = async () => {
        setIsDownloading(true);
        setError(null);
        try {
            const backupData = await getBackupData();
            const blob = new Blob([backupData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            a.href = url;
            a.download = `luu-visa-consultant-backup-${timestamp}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast({ title: "Backup Created", description: "Your site data has been downloaded." });
        } catch (err) {
            setError("Failed to create backup.");
            console.error(err);
        }
        setIsDownloading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleRestore = async () => {
        if (!selectedFile) {
            setError("Please select a backup file to restore.");
            return;
        }

        setIsRestoring(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target?.result as string;
            try {
                const result = await restoreBackupData(content);
                if (result.success) {
                    toast({ title: "Restore Successful", description: "Your site data has been restored from the backup file." });
                    setSelectedFile(null);
                     // Force a full page reload to reflect changes
                    window.location.reload();
                } else {
                    setError(result.error || "An unknown error occurred during restore.");
                }
            } catch (err) {
                setError("Failed to restore data. The backup file may be invalid.");
                console.error(err);
            }
            setIsRestoring(false);
        };
        reader.onerror = () => {
            setError("Failed to read the selected file.");
            setIsRestoring(false);
        };
        reader.readAsText(selectedFile);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Create Backup</CardTitle>
                    <CardDescription>Download a complete backup of all your site's data as a single JSON file.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">This backup will include services, testimonials, hero images, about content, emails, manifest entries, and site settings.</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleDownload} disabled={isDownloading}>
                        {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        {isDownloading ? "Creating..." : "Download Backup"}
                    </Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Restore from Backup</CardTitle>
                    <CardDescription>Upload a previously created backup file to restore your site's data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-destructive font-semibold">Warning: This action is irreversible and will overwrite all current site data with the contents of the backup file.</p>
                    <Input type="file" accept=".json" onChange={handleFileChange} />
                     {selectedFile && (
                        <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>
                    )}
                </CardContent>
                <CardFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isRestoring || !selectedFile}>
                                {isRestoring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                {isRestoring ? "Restoring..." : "Restore Data"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action will permanently replace all current data with the content from the file <strong className="font-bold">{selectedFile?.name}</strong>. This cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleRestore}>
                                     {isRestoring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Yes, restore now
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>

            {error && (
                <Alert variant="destructive" className="md:col-span-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
