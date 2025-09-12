'use client';

import { useState, useMemo } from 'react';
import type { ManifestEntry } from '@/lib/manifest';
import ManifestList from './manifest-list';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function ManifestClient({ initialEntries }: { initialEntries: ManifestEntry[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = useMemo(() => {
    if (!searchTerm) {
      return initialEntries;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return initialEntries.filter(entry =>
        entry.clientName.toLowerCase().includes(lowercasedTerm) ||
        entry.description.toLowerCase().includes(lowercasedTerm) ||
        entry.id.toLowerCase().includes(lowercasedTerm)
    );
  }, [initialEntries, searchTerm]);

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>A complete log of all debit and credit entries.</CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="w-full bg-background pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
            <ManifestList entries={filteredEntries} />
        </CardContent>
    </Card>
  );
}
