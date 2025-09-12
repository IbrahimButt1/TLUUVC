'use client';

import type { Email } from '@/lib/emails';
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';
import { format, isToday, isThisYear } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';

interface EmailListProps {
  emails: Email[];
  selectedEmails: string[];
  onSelectEmail: (id: string, checked: boolean | 'indeterminate') => void;
  onViewEmail: (email: Email) => void;
  onToggleFavorite: (id: string, isFavorited: boolean) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) {
    return format(date, 'p'); // e.g., 4:30 PM
  }
  if (isThisYear(date)) {
    return format(date, 'MMM d'); // e.g., Jun 5
  }
  return format(date, 'P'); // e.g., 06/05/2023
};

function EmailDate({ dateString, isRead }: { dateString: string, isRead: boolean }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const formattedDate = isMounted ? formatDate(dateString) : '';

    return (
        <TableCell className={cn("w-24 text-right text-sm text-muted-foreground", !isRead && "font-bold text-foreground")}>
            {isMounted ? formattedDate : '...'}
        </TableCell>
    );
}

export default function EmailList({ emails, selectedEmails, onSelectEmail, onViewEmail, onToggleFavorite }: EmailListProps) {
  
  if (emails.length === 0) {
    return <div className="text-center text-muted-foreground p-12">No emails found.</div>;
  }
  
  return (
    <div className="overflow-auto">
        <Table>
            <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[80px]">Select</TableHead>
                    <TableHead className="w-[80px]">Favorite</TableHead>
                    <TableHead className="w-[180px]">Client</TableHead>
                    <TableHead>Subject & Preview</TableHead>
                    <TableHead className="w-[100px] text-right">Time</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {emails.map(email => (
                    <TableRow 
                        key={email.id} 
                        className={cn(
                            "cursor-pointer",
                            selectedEmails.includes(email.id) && "bg-muted/50"
                        )}
                        onClick={() => onViewEmail(email)}
                    >
                        <TableCell className="w-12 px-4" onClick={(e) => e.stopPropagation()}>
                           <Checkbox 
                                id={`select-${email.id}`} 
                                checked={selectedEmails.includes(email.id)}
                                onCheckedChange={(checked) => onSelectEmail(email.id, checked)}
                              />
                        </TableCell>
                         <TableCell className="w-12 px-4" onClick={(e) => e.stopPropagation()}>
                            <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onToggleFavorite(email.id, !!email.favorited)}
                            >
                            <Star className={cn(
                                "h-5 w-5 text-muted-foreground transition-colors",
                                email.favorited && "text-yellow-500 fill-yellow-400"
                            )} />
                            </Button>
                        </TableCell>
                        <TableCell className={cn("w-48 font-medium", !email.read && "font-bold")}>
                            {email.name}
                        </TableCell>
                        <TableCell>
                            <span className={cn("font-medium", !email.read && "font-bold")}>{email.subject}</span>
                            <span className="text-muted-foreground"> - {email.message.substring(0, 100)}...</span>
                        </TableCell>
                        <EmailDate dateString={email.receivedAt} isRead={email.read} />
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}