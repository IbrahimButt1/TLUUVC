'use client';

import { useState, useMemo } from 'react';
import type { LogEntry } from '@/lib/logs';
import LogsList from './logs-list';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function LogsClient({ initialLogs }: { initialLogs: LogEntry[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = useMemo(() => {
    if (!searchTerm) {
      return initialLogs;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return initialLogs.filter(log =>
        log.action.toLowerCase().includes(lowercasedTerm) ||
        log.details.toLowerCase().includes(lowercasedTerm)
    );
  }, [initialLogs, searchTerm]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
         <div className="space-y-1">
            <CardTitle>System Activity Logs</CardTitle>
            <CardDescription>A record of all significant actions performed in the admin panel.</CardDescription>
        </div>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search logs..."
            className="w-full md:w-80 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <LogsList 
          logs={filteredLogs}
        />
      </CardContent>
    </Card>
  );
}
