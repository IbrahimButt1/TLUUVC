'use client';

import { useState, useEffect, useMemo } from 'react';
import { markAllEmailsAsRead, type Email } from '@/lib/emails';
import InboxList from './inbox-list';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function InboxClient({ initialEmails }: { initialEmails: Email[] }) {
  const [emails, setEmails] = useState(initialEmails);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // This function will run on the client after the component mounts
    // to mark emails as read.
    markAllEmailsAsRead();
  }, []);

  const filteredEmails = useMemo(() => {
    if (!searchTerm) {
      return emails;
    }
    return emails.filter(email =>
      email.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [emails, searchTerm]);

  return (
    <div>
       <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
            type="search"
            placeholder="Search emails..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <InboxList emails={filteredEmails} searchTerm={searchTerm} />
    </div>
  );
}
