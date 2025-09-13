'use client';

import { useState, useMemo, useTransition } from 'react';
import type { ManifestEntry } from '@/lib/manifest';
import { toggleManifestEntryStatus } from '@/lib/manifest';
import ManifestList from './manifest-list';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManifestChart from './manifest-chart';

export default function ManifestClient({ initialEntries }: { initialEntries: ManifestEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleToggleStatus = (id: string, currentStatus: 'active' | 'inactive') => {
    startTransition(async () => {
      const originalEntries = [...entries];
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      // Optimistic update
      setEntries(current => current.map(e => e.id === id ? { ...e, status: newStatus } : e));
      
      const formData = new FormData();
      formData.append('id', id);

      try {
        const result = await toggleManifestEntryStatus(formData);
        if (result.success) {
          toast({
            title: "Status Updated",
            description: `Entry has been marked as ${newStatus}.`,
          });
        } else {
          setEntries(originalEntries);
          toast({ title: "Error", description: result.error, variant: "destructive" });
        }
      } catch (error) {
        setEntries(originalEntries);
        toast({ title: "Error", description: "Failed to update status. Please try again.", variant: "destructive" });
      }
    });
  };

  const filteredAndSortedEntries = useMemo(() => {
    let tabFiltered = entries;
    if (activeTab === 'active') {
      tabFiltered = entries.filter(e => e.status === 'active');
    } else if (activeTab === 'inactive') {
      tabFiltered = entries.filter(e => e.status === 'inactive');
    }

    const searched = searchTerm
      ? tabFiltered.filter(entry =>
          entry.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : tabFiltered;
    
    return searched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries, searchTerm, activeTab]);

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
    <Tabs value={activeTab} onValueChange={setActiveTab}>
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
            <div className="flex items-center gap-2">
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
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </div>
        </CardHeader>
        <CardContent>
            <TabsContent value="all" className="m-0">
                {/* Content is rendered outside TabsContent */}
            </TabsContent>
             <TabsContent value="active" className="m-0">
                {/* Content is rendered outside TabsContent */}
            </TabsContent>
             <TabsContent value="inactive" className="m-0">
                {/* Content is rendered outside TabsContent */}
            </TabsContent>
            <ManifestList 
                entries={filteredAndSortedEntries} 
                onToggleStatus={handleToggleStatus}
                isPending={isPending}
            />
        </CardContent>
    </Card>
  </Tabs>
  );
}
