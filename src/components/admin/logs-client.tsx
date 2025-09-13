
'use client';

import { useState, useMemo } from 'react';
import type { LogEntry } from '@/lib/logs';
import LogsList from './logs-list';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
    <div>
       <div className="mb-6">
         <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search logs..."
                className="w-full bg-background pr-10 pl-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>
      <LogsList 
        logs={filteredLogs}
      />
    </div>
  );
}
