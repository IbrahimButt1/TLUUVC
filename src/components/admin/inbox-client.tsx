'use client';

import { useState, useMemo, useTransition } from 'react';
import type { Email } from '@/lib/emails';
import { deleteEmail, markAllEmailsAsRead } from '@/lib/emails';
import { Button } from '@/components/ui/button';
import EmailList from './email-list';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, MoreVertical, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import EmailView from './email-view';

export default function InboxClient({ initialEmails }: { initialEmails: Email[] }) {
  const [emails, setEmails] = useState(initialEmails);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState<Email | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useMemo(() => {
    markAllEmailsAsRead();
  }, []);

  const filteredEmails = useMemo(() => {
    return searchTerm
      ? emails.filter(email =>
          email.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.subject.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : emails;
  }, [emails, searchTerm]);

  const handleSelectEmail = (id: string, checked: boolean | 'indeterminate') => {
    if (checked) {
      setSelectedEmails(prev => [...prev, id]);
    } else {
      setSelectedEmails(prev => prev.filter(emailId => emailId !== id));
    }
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked) {
      setSelectedEmails(filteredEmails.map(e => e.id));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleDeleteSelected = () => {
    startTransition(async () => {
      const originalEmails = [...emails];
      setEmails(current => current.filter(e => !selectedEmails.includes(e.id)));
      
      try {
        for (const id of selectedEmails) {
          const formData = new FormData();
          formData.append('id', id);
          await deleteEmail(formData);
        }
        toast({
          title: `${selectedEmails.length} email(s) moved to trash.`,
        });
        setSelectedEmails([]);
      } catch (error) {
        setEmails(originalEmails);
        toast({
          title: "Error",
          description: "Failed to move emails to trash.",
          variant: "destructive",
        });
      }
    });
  };

  const isAllSelected = filteredEmails.length > 0 && selectedEmails.length === filteredEmails.length;
  const isIndeterminate = selectedEmails.length > 0 && selectedEmails.length < filteredEmails.length;

  return (
    <Card className="shadow-sm border">
      <CardContent className="p-0">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search emails..."
                className="pl-10 w-full bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center p-2 border-b h-14">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="select-all"
              checked={isAllSelected || isIndeterminate}
              onCheckedChange={handleSelectAll}
            />
            <Button variant="ghost" size="icon" onClick={() => window.location.reload()}>
              <RefreshCw className="h-5 w-5" />
            </Button>
            {selectedEmails.length > 0 && (
              <Button variant="ghost" size="icon" onClick={handleDeleteSelected}>
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <EmailList 
          emails={filteredEmails} 
          selectedEmails={selectedEmails}
          onSelectEmail={handleSelectEmail}
          onViewEmail={setCurrentEmail}
        />
        {currentEmail && (
            <EmailView 
                email={currentEmail}
                open={!!currentEmail}
                onOpenChange={(isOpen) => {
                    if(!isOpen) setCurrentEmail(null);
                }}
            />
        )}
      </CardContent>
    </Card>
  );
}