'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from 'date-fns';
import type { Email } from "@/lib/emails";
import React, { useState, useEffect } from "react";
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
import { cn } from "@/lib/utils";

function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
    if (!highlight.trim()) {
        return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <span key={i} className="bg-yellow-200 text-black px-0.5 rounded-sm">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </span>
    );
}

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

function RestoreButton({ isPending }: ActionButtonProps) {
    return (
        <Button variant="outline" size="sm" type="submit" disabled={isPending} className="w-40 justify-center">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isPending && <Undo className="mr-2 h-4 w-4" />}
            Restore
        </Button>
    )
}

export default function TrashEmails({ emails, searchTerm, onRestore, onDelete, isPending }: { emails: Email[], searchTerm: string, onRestore: (id: string) => void, onDelete: (id: string) => void, isPending: boolean }) {
    const [isClient, setIsClient] = useState(false);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || (emails.length === 0 && !isPending)) {
        return <CardContent><p className="p-6 text-center text-muted-foreground">The recycle bin for emails is empty.</p></CardContent>;
    }

    return (
        <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
                {emails.map((email) => (
                    <AccordionItem value={email.id} key={email.id} className="border-b">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 rounded-md transition-colors data-[state=open]:bg-muted">
                            <div className="flex justify-between w-full items-center">
                                <div className="flex items-center gap-4 text-left">
                                    <span className="font-semibold w-40 truncate">
                                        <HighlightedText text={email.name} highlight={searchTerm} />
                                    </span>
                                    <div className="flex-1 text-sm text-muted-foreground truncate">
                                        <span className="font-medium text-foreground">
                                           <HighlightedText text={email.subject} highlight={searchTerm} />
                                        </span>
                                        <span className="ml-2 text-muted-foreground">
                                           - <HighlightedText text={email.message} highlight={searchTerm} />
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0 ml-4">
                                    {isClient ? format(new Date(email.receivedAt), "PPp") : ''}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-6 pt-2">
                            <div className="space-y-4 bg-muted/50 p-4 rounded-md">
                                <p className="text-sm"><strong>From:</strong> <a href={`mailto:${email.email}`} className="text-primary hover:underline"><HighlightedText text={email.email} highlight={searchTerm} /></a></p>

                                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                    <HighlightedText text={email.message} highlight={searchTerm} />
                                </p>
                                <div className="flex justify-end pt-2 gap-2 w-full">
                                    <form className="inline-block" action={() => onRestore(email.id)}>
                                        <input type="hidden" name="id" value={email.id} />
                                        <RestoreButton isPending={isPending} />
                                    </form>
                                    <AlertDialog open={openDialogId === email.id} onOpenChange={(isOpen) => setOpenDialogId(isOpen ? email.id : null)}>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm" disabled={isPending} className="w-40 justify-center">
                                                <Trash2 className="mr-2 h-4 w-4" />
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
                                                <form action={() => {
                                                    onDelete(email.id)
                                                    setOpenDialogId(null)
                                                }}>
                                                    <input type="hidden" name="id" value={email.id} />
                                                    <DeleteConfirmationButton isPending={isPending} />
                                                </form>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
    );
}
