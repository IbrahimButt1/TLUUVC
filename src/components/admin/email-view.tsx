"use client";

import type { Email } from '@/lib/emails';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Button } from '../ui/button';

interface EmailViewProps {
  email: Email;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EmailView({ email, open, onOpenChange }: EmailViewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-xl font-bold">{email.subject}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 pt-1">
             <span className="font-semibold">{email.name}</span>
             <span className="text-xs text-muted-foreground">&lt;{email.email}&gt;</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow p-6 overflow-y-auto">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {email.message}
            </p>
        </div>
        <DialogFooter className="p-4 border-t bg-muted/50">
            <div className="flex justify-between items-center w-full">
                <p className="text-xs text-muted-foreground">
                    Received: {format(new Date(email.receivedAt), "PPP p")}
                </p>
                <div className="space-x-2">
                    <Button variant="outline">Reply</Button>
                    <Button variant="outline">Delete</Button>
                </div>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
