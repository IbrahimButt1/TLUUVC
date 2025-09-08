'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { deleteEmail, markAllEmailsAsRead, type Email } from '@/lib/emails';
import InboxList from './inbox-list';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { isToday, isYesterday, isWithinInterval, subDays, startOfDay } from 'date-fns';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export interface GroupedEmails {
    today: Email[];
    yesterday: Email[];
    last7Days: Email[];
    older: Email[];
}

export default function InboxClient({ initialEmails }: { initialEmails: Email[] }) {
  const [emails, setEmails] = useState(initialEmails);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    // This function will run on the client after the component mounts
    // to mark emails as read.
    markAllEmailsAsRead();
  }, []);

  const handleDelete = (emailId: string) => {
    startTransition(async () => {
      // Optimistically update the UI
      setEmails(currentEmails => currentEmails.filter(e => e.id !== emailId));
      
      const formData = new FormData();
      formData.append('id', emailId);

      try {
        await deleteEmail(formData);
        toast({
          title: "Email moved to trash",
        });
      } catch (error) {
        // Revert the optimistic update on error
        setEmails(initialEmails); 
        toast({
          title: "Error",
          description: "Failed to move email to trash. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const filteredAndGroupedEmails: GroupedEmails = useMemo(() => {
    const filtered = searchTerm
      ? emails.filter(email =>
          email.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.message.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : emails;

    const groups: GroupedEmails = {
        today: [],
        yesterday: [],
        last7Days: [],
        older: []
    };
    
    const now = new Date();
    const startOfToday = startOfDay(now);
    const startOfYesterday = startOfDay(subDays(now, 1));
    const startOfLastWeek = startOfDay(subDays(now, 7));

    filtered.forEach(email => {
        const emailDate = new Date(email.receivedAt);
        if (isToday(emailDate)) {
            groups.today.push(email);
        } else if (isYesterday(emailDate)) {
            groups.yesterday.push(email);
        } else if (isWithinInterval(emailDate, { start: startOfLastWeek, end: startOfYesterday })) {
            groups.last7Days.push(email);
        } else {
            groups.older.push(email);
        }
    });

    return groups;

  }, [emails, searchTerm]);

  return (
    <Card className="shadow-none border-0">
       <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
            type="search"
            placeholder="Search emails..."
            className="pl-10 w-full bg-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <InboxList 
        groupedEmails={filteredAndGroupedEmails} 
        searchTerm={searchTerm} 
        onDelete={handleDelete}
        isPending={isPending}
      />
    </Card>
  );
}
