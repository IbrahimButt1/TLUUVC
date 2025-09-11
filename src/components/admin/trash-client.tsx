'use client';

import { useState, useMemo, useTransition } from 'react';
import { permanentlyDeleteEmail, restoreEmail, type Email } from '@/lib/emails';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import TrashList from './trash-list';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function TrashClient({ initialEmails }: { initialEmails: Email[] }) {
  const [emails, setEmails] = useState(initialEmails);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAction = (
    action: (formData: FormData) => Promise<void>,
    emailId: string,
    successMessage: string,
    revertState: Email[]
  ) => {
    startTransition(async () => {
      // Optimistically update the UI
      setEmails(currentEmails => currentEmails.filter(e => e.id !== emailId));
      
      const formData = new FormData();
      formData.append('id', emailId);

      try {
        await action(formData);
        toast({ title: successMessage });
      } catch (error) {
        // Revert the optimistic update on error
        setEmails(revertState); 
        const errorMessage = error instanceof Error ? error.message : "Failed to perform action. Please try again.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };

  const handleRestore = (emailId: string) => {
    handleAction(restoreEmail, emailId, "Email restored", emails);
  };
  
  const handlePermanentDelete = (emailId: string) => {
    handleAction(permanentlyDeleteEmail, emailId, "Email permanently deleted", emails);
  };


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
    <div className="space-y-4">
       <Card className="shadow-none">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search trash..."
                className="pl-10 w-full bg-card"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
       </Card>
      {isPending && (
        <div className="flex items-center justify-center py-4 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Processing...</span>
        </div>
      )}
      <TrashList 
        emails={filteredEmails} 
        searchTerm={searchTerm} 
        onRestore={handleRestore}
        onDelete={handlePermanentDelete}
        isPending={isPending}
      />
    </div>
  );
}
