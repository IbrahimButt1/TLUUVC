'use client';

import { useState, useMemo, useTransition } from 'react';
import type { ManifestEntry } from '@/lib/manifest';
import { toggleManifestEntryStatus } from '@/lib/manifest';
import ManifestList from './manifest-list';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';

export default function ManifestClient({ initialEntries }: { initialEntries: ManifestEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [searchTerm, setSearchTerm] = useState('');
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
          // To ensure we have the very latest data, we can re-fetch or just confirm the optimistic update
          // For simplicity, we are relying on the optimistic update.
        } else {
          setEntries(originalEntries); // Revert on error
          toast({ title: "Error", description: result.error, variant: "destructive" });
        }
      } catch (error) {
        setEntries(originalEntries);
        toast({ title: "Error", description: "Failed to update status. Please try again.", variant: "destructive" });
      }
    });
  };

  const filteredEntries = useMemo(() => {
    if (!searchTerm) {
      return entries;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return entries.filter(entry =>
        entry.clientName.toLowerCase().includes(lowercasedTerm) ||
        entry.description.toLowerCase().includes(lowercasedTerm) ||
        entry.id.toLowerCase().includes(lowercasedTerm)
    );
  }, [entries, searchTerm]);

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>A complete log of all debit and credit entries.</CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="w-full bg-background pr-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
            <ManifestList 
                entries={filteredEntries} 
                onToggleStatus={handleToggleStatus}
                isPending={isPending}
            />
        </CardContent>
    </Card>
  );
}
