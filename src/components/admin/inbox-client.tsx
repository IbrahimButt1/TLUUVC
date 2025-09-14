'use client';

import { useState, useMemo, useTransition, useEffect } from 'react';
import type { Email } from '@/lib/emails';
import {
  deleteEmail,
  getEmails,
  markAllEmailsAsRead,
  markEmailAsRead,
  toggleEmailFavorite,
  restoreEmail,
} from '@/lib/emails';
import { Button } from '@/components/ui/button';
import EmailList from './email-list';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, MoreVertical, Trash2, MailCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import EmailView from './email-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ToastAction } from '@/components/ui/toast';

export default function InboxClient({ initialEmails }: { initialEmails: Email[] }) {
  // ✅ Always ensure it's array
  const [emails, setEmails] = useState<Email[]>(Array.isArray(initialEmails) ? initialEmails : []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState<Email | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'favorites'>('all');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // ✅ Polling for new emails safely
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: latestEmails } = await getEmails({ page: 1, perPage: 50 });

      setEmails(currentEmails => {
        if (!Array.isArray(currentEmails)) return latestEmails;
        const currentIds = new Set(currentEmails.map(e => e.id));
        const newEmails = latestEmails.filter(e => !currentIds.has(e.id));
        const updatedExistingEmails = currentEmails.map(
          ce => latestEmails.find(le => le.id === ce.id) || ce
        );
        return [...newEmails, ...updatedExistingEmails];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Safe filtering
  const filteredEmails = useMemo(() => {
    if (!Array.isArray(emails)) return []; // safety

    let tabFiltered = emails.filter(e => e.status === 'inbox');
    if (activeTab === 'unread') {
      tabFiltered = emails.filter(e => e.status === 'inbox' && !e.read);
    } else if (activeTab === 'favorites') {
      tabFiltered = emails.filter(e => e.status === 'inbox' && e.favorited);
    }

    return searchTerm
      ? tabFiltered.filter(email =>
          email.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.subject.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : tabFiltered;
  }, [emails, searchTerm, activeTab]);

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

  const handleUndoDelete = (idsToRestore: string[], originalEmailsState: Email[]) => {
    startTransition(async () => {
      setEmails(originalEmailsState);
      for (const id of idsToRestore) {
        const formData = new FormData();
        formData.append('id', id);
        await restoreEmail(formData);
      }
    });
  };

  const handleDeleteSingleEmail = (id: string) => {
    handleDeleteSelected([id]);
  };

  const handleDeleteSelected = (idsToDelete?: string[]) => {
    const ids = idsToDelete || selectedEmails;
    if (ids.length === 0) return;
    const originalEmails = [...emails];

    startTransition(async () => {
      setEmails(current => current.map(e => ids.includes(e.id) ? { ...e, status: 'trash' } : e));
      setSelectedEmails([]);

      try {
        for (const id of ids) {
          const formData = new FormData();
          formData.append('id', id);
          await deleteEmail(formData);
        }

        toast({
          title: `${ids.length} email(s) moved to Recycle Bin.`,
          action: (
            <ToastAction altText="Undo" onClick={() => handleUndoDelete(ids, originalEmails)}>
              Undo
            </ToastAction>
          ),
        });
      } catch (error) {
        setEmails(originalEmails);
        toast({
          title: "Error",
          description: "Failed to move emails to Recycle Bin.",
          variant: "destructive",
        });
      }
    });
  };

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      const originalEmails = [...emails];
      const allReadEmails = emails.map(e => e.status === 'inbox' ? { ...e, read: true } : e);
      setEmails(allReadEmails);

      try {
        await markAllEmailsAsRead();
        toast({ title: "All emails marked as read." });
      } catch (error) {
        setEmails(originalEmails);
        toast({
          title: "Error",
          description: "Failed to mark emails as read.",
          variant: "destructive",
        });
      }
    });
  };

  const handleToggleFavorite = (id: string, isFavorited: boolean) => {
    startTransition(async () => {
      const originalEmails = [...emails];
      setEmails(current =>
        current.map(e => e.id === id ? { ...e, favorited: !e.favorited } : e)
      );

      const formData = new FormData();
      formData.append('id', id);
      try {
        await toggleEmailFavorite(formData);
        toast({ title: isFavorited ? "Removed from favorites" : "Added to favorites" });
      } catch (error) {
        setEmails(originalEmails);
        toast({
          title: "Error",
          description: "Could not update favorite status.",
          variant: "destructive",
        });
      }
    });
  };

  const handleViewEmail = (email: Email) => {
    setCurrentEmail(email);
    if (!email.read) {
      startTransition(async () => {
        const originalEmails = [...emails];
        setEmails(current => current.map(e => e.id === email.id ? { ...e, read: true } : e));

        const formData = new FormData();
        formData.append('id', email.id);
        try {
          const result = await markEmailAsRead(formData);
          if (!result.success) setEmails(originalEmails);
        } catch (error) {
          setEmails(originalEmails);
        }
      });
    }
  };

  const isAllSelected = filteredEmails.length > 0 && selectedEmails.length === filteredEmails.length;
  const isIndeterminate = selectedEmails.length > 0 && selectedEmails.length < filteredEmails.length;
  const unreadCount = useMemo(
    () => Array.isArray(emails) ? emails.filter(e => e.status === 'inbox' && !e.read).length : 0,
    [emails]
  );

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
      <div className="flex items-center justify-between px-1 mb-6">
        <h1 className="text-3xl font-bold">Email Inbox</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search emails..."
              className="pr-10 w-full md:w-80 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Unread
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
        </div>
      </div>
      <div className="flex items-center p-2 border-t border-b h-14">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={isAllSelected || isIndeterminate}
            onCheckedChange={handleSelectAll}
            onClick={(e) => e.stopPropagation()}
          />
          <Button variant="ghost" size="icon" onClick={() => window.location.reload()} disabled={isPending}>
            <RefreshCw className="h-5 w-5" />
          </Button>
          {selectedEmails.length > 0 && (
            <Button variant="ghost" size="icon" onClick={() => handleDeleteSelected()} disabled={isPending}>
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isPending}>
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={handleMarkAllAsRead}>
                <MailCheck className="mr-2 h-4 w-4" />
                <span>Mark all as read</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="shadow-none border">
        <CardContent className="p-0">
          <EmailList
            emails={filteredEmails}
            selectedEmails={selectedEmails}
            onSelectEmail={handleSelectEmail}
            onViewEmail={handleViewEmail}
            onToggleFavorite={handleToggleFavorite}
          />
          {currentEmail && (
            <EmailView
              email={currentEmail}
              open={!!currentEmail}
              onOpenChange={(isOpen) => !isOpen && setCurrentEmail(null)}
              onDelete={handleDeleteSingleEmail}
            />
          )}
        </CardContent>
      </Card>
    </Tabs>
  );
}