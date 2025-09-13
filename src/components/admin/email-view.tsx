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
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

interface EmailViewProps {
  email: Email;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
}

export default function EmailView({ email, open, onOpenChange, onDelete }: EmailViewProps) {
  
  const handleDelete = () => {
    onDelete(email.id);
    onOpenChange(false);
  }

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
                    <Button variant="outline" asChild className="bg-green-100 hover:bg-green-200 text-green-800 border-green-200 hover:border-green-300 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900/40">
                        <a href={`mailto:${email.email}?subject=Re: ${encodeURIComponent(email.subject)}`}>
                            Reply
                        </a>
                    </Button>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Move to Recycle Bin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This will move the email to the recycle bin. You can permanently delete it from there.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Move to Recycle Bin
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
