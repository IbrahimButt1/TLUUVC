'use client';

import { useState, useMemo, useTransition } from 'react';
import type { ManifestEntry } from '@/lib/manifest';
import ManifestList from './manifest-list';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManifestChart from './manifest-chart';
import { getExchangeRate } from '@/lib/currency';

export default function ManifestClient({ initialEntries, rate }: { initialEntries: ManifestEntry[], rate: number | null }) {
  const [entries, setEntries] = useState(initialEntries);
  const [searchTerm, setSearchTerm] = useState('');
  
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
                    {rate && <p className="text-sm text-muted-foreground">PKR {(totals.credit * rate).toFixed(2)}</p>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total Debit</CardTitle>
                    <CardDescription>Sum of all active outgoing amounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-red-600">${totals.debit.toFixed(2)}</p>
                    {rate && <p className="text-sm text-muted-foreground">PKR {(totals.debit * rate).toFixed(2)}</p>}
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
                    {rate && <p className={`text-sm ${balance >= 0 ? 'text-muted-foreground' : 'text-red-500'}`}>PKR {(balance * rate).toFixed(2)}</p>}
                </CardContent>
            </Card>
        </div>

      <Card>
          <CardHeader>
              <CardTitle>Financial Overview (Active Entries)</CardTitle>
              <CardDescription>A visual summary of your credits, debits, and running balance based on active transactions.</CardDescription>
          </CardHeader>
          <CardContent>
              <ManifestChart entries={activeEntries} />
          </CardContent>
      </Card>
      
      <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>A complete log of all debit and credit entries.</CardDescription>
                </div>
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search transactions..."
                        className="w-full md:w-80 bg-background pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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