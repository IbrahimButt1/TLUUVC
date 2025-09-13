'use client';

import { useState, useMemo, useTransition } from 'react';
import type { ManifestEntry } from '@/lib/manifest';
import { getManifestEntries } from '@/lib/manifest';
import ManifestList from './manifest-list';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';


export default function ManifestClient({ initialEntries }: { initialEntries: ManifestEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
        const allEntries = await getManifestEntries();
        // Format data for Excel
        const dataToExport = allEntries.map(e => ({
            "Transaction ID": e.id,
            "Client ID": e.clientId,
            "Client Name": e.clientName,
            "Date": e.date,
            "Description": e.description,
            "Type": e.type,
            "Amount": e.amount,
            "Status": e.status,
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Manifest");

        // Generate and trigger download
        const timestamp = new Date().toISOString().split('T')[0];
        XLSX.writeFile(workbook, `manifest-backup-${timestamp}.xls`, { bookType: 'biff8' });

        toast({ title: "Manifest Downloaded", description: "All transaction records have been saved as an Excel file." });
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