'use client';

import { useState, useMemo } from 'react';
import type { Email } from '@/lib/emails';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import TrashList from './trash-list';

export default function TrashClient({ initialEmails }: { initialEmails: Email[] }) {
  const [emails, setEmails] = useState(initialEmails);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmails: Email[] = useMemo(() => {
    return searchTerm
      ? emails.filter(email =>
          email.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.message.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : emails;
  }, [emails, searchTerm]);

  return (
    <Card className="shadow-none border-0">
       <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
            type="search"
            placeholder="Search trash..."
            className="pl-10 w-full bg-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <TrashList emails={filteredEmails} searchTerm={searchTerm} />
    </Card>
  );
}
