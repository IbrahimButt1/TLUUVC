'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import type { Email } from "@/lib/emails";
import { Button } from "../ui/button";
import { Trash2, Undo, Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from '@/components/ui/table';

interface ActionButtonProps {
    isPending: boolean;
}

function DeleteConfirmationButton({ isPending }: ActionButtonProps) {
    return (
        <Button variant="destructive" type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Permanently
        </Button>
    )
}

function RestoreButton({ isPending, onRestore }: ActionButtonProps & { onRestore: () => void }) {
    return (
        <Button variant="outline" size="sm" type="button" onClick={onRestore} disabled={isPending} className="w-28 justify-center">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isPending && <Undo className="mr-1.5 h-4 w-4" />}
            Restore
        </Button>
    )
}

function EmailDate({ dateString }: { dateString: string }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <span>...</span>;
    }

    return <span>{format(new Date(dateString), "PPP p")}</span>;
}


export default function TrashEmails({ emails, searchTerm, onRestore, onDelete, isPending }: { emails: Email[], searchTerm: string, onRestore: (id: string) => void, onDelete: (id: string) => void, isPending: boolean }) {
    
    if (emails.length === 0 && !isPending) {
        return <CardContent><p className="p-6 text-center text-muted-foreground">The recycle bin for emails is empty.</p></CardContent>;
    }

    return (
        <CardContent className="p-0">
             <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>Client / Subject</TableHead>
                        <TableHead className="w-[200px]">Date Received</TableHead>
                        <TableHead className="w-[300px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {emails.map((email) => (
                        <TableRow key={email.id}>
                            <TableCell>
                                <div className="font-semibold">{email.name}</div>
                                <div className="text-sm text-muted-foreground">{email.subject} - <span className="italic">{email.message.substring(0,50)}...</span></div>
                            </TableCell>
                             <TableCell className="text-sm text-muted-foreground">
                                <EmailDate dateString={email.receivedAt} />
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <RestoreButton isPending={isPending} onRestore={() => onRestore(email.id)} />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" disabled={isPending} className="w-40 justify-center">
                                            <Trash2 className="mr-1.5 h-4 w-4" />
                                            Delete Permanently
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete this email.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <form action={() => onDelete(email.id)}>
                                                <DeleteConfirmationButton isPending={isPending} />
                                            </form>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    );
}
