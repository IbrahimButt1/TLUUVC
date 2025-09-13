'use client';

import { useState, useMemo, useTransition } from 'react';
import type { ManifestEntry } from '@/lib/manifest';
import { closeOutManifestEntries, getManifestAsJson } from '@/lib/manifest';
import ManifestList from './manifest-list';
import { Input } from '@/components/ui/input';
import { Search, Trash2, Loader2, Info, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
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

export default function ManifestClient({ initialEntries }: { initialEntries: ManifestEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [recentlyClosed, setRecentlyClosed] = useState<ManifestEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  
  const filteredAndSortedEntries = useMemo(() => {
    return searchTerm
      ? entries.filter(entry =>
          entry.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : entries;
  }, [entries, searchTerm]);

  const activeEntries = useMemo(() => entries.filter(e => e.status === 'active'), [entries]);

  const totals = activeEntries.reduce((acc, entry) => {
    if (entry.type === 'debit') {
      acc.debit += entry.amount;
    } else {
      acc.credit += entry.amount;
    }
    return acc;
  }, { debit: 0, credit: 0 });

  const balance = totals.credit - totals.debit;
  
  const handleCloseOut = () => {
    startTransition(async () => {
        try {
            const closedEntries = await closeOutManifestEntries();
            
            const allEntries = [...entries.map(e => activeEntries.find(ae => ae.id === e.id) ? {...e, status: 'inactive' as const} : e )];
            setEntries(allEntries);

            setRecentlyClosed(closedEntries);
            toast({
                title: "Records Closed Out",
                description: "All active transaction records have been archived.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to close out records. Please try again.",
                variant: "destructive",
            });
        }
    });
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
        const jsonData = await getManifestAsJson();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const timestamp = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `manifest-backup-${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Manifest Downloaded", description: "All transaction records have been saved." });
    } catch (err) {
        toast({ title: "Error", description: "Failed to download manifest.", variant: "destructive" });
        console.error(err);
    }
    setIsDownloading(false);
};


  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
                <CardHeader>
                    <CardTitle>Total Credit</CardTitle>
                    <CardDescription>Sum of all active incoming amounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-green-600">${totals.credit.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total Debit</CardTitle>
                    <CardDescription>Sum of all active outgoing amounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-red-600">${totals.debit.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Net Balance</CardTitle>
                    <CardDescription>Credit minus Debit from active entries.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${balance.toFixed(2)}
                    </p>
                </CardContent>
            </Card>
        </div>
      
      {recentlyClosed.length > 0 && (
            <Card className="mt-6 border-amber-500/50 bg-amber-50/50 dark:bg-amber-900/10">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Info className="h-6 w-6 text-amber-600"/>
                        <div>
                            <CardTitle>Recently Closed Records</CardTitle>
                            <CardDescription>The following records were just moved to 'inactive' status.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ManifestList entries={recentlyClosed} />
                </CardContent>
            </Card>
        )}

      <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>A complete log of all debit and credit entries.</CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading}>
                        {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        Download Records
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={isPending || activeEntries.length === 0}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                Close Out Records
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently mark all <strong className="font-bold">{activeEntries.length} active</strong> transaction(s) as 'inactive', effectively archiving them.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleCloseOut} className="bg-destructive hover:bg-destructive/90">
                                    Yes, close them out
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search transactions..."
                            className="w-full md:w-80 bg-background"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ManifestList 
                    entries={filteredAndSortedEntries} 
                />
            </CardContent>
    </Card>
  </>
  );
}