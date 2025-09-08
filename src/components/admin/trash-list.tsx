'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from 'date-fns';
import type { Email } from "@/lib/emails";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Trash2, Undo } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { permanentlyDeleteEmail, restoreEmail } from "@/lib/emails";
import { DeleteButton } from "./delete-button";


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


export default function TrashList({ emails, searchTerm }: { emails: Email[], searchTerm: string }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const hasEmails = emails.length > 0;

    return (
        <Card className="border shadow-sm">
            <CardContent className="p-0">
                {!hasEmails ? (
                    <p className="p-6 text-center text-muted-foreground">The trash is empty.</p>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                       {emails.map((email) => (
                            <AccordionItem value={email.id} key={email.id} className="border-b">
                                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 rounded-md transition-colors data-[state=open]:bg-muted">
                                    <div className="flex justify-between w-full items-center">
                                        <div className="flex flex-col text-left gap-1">
                                            <span className="font-medium">
                                                <HighlightedText text={email.name} highlight={searchTerm} />
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                <HighlightedText text={email.subject} highlight={searchTerm} />
                                            </span>
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
                                        <div className="flex justify-end pt-2 gap-2">
                                            <form action={restoreEmail}>
                                                <input type="hidden" name="id" value={email.id} />
                                                <Button variant="outline" size="sm" type="submit">
                                                    <Undo className="mr-2 h-4 w-4" />
                                                    Restore
                                                </Button>
                                            </form>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm">
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
                                                        <form action={permanentlyDeleteEmail}>
                                                            <input type="hidden" name="id" value={email.id} />
                                                            <DeleteButton />
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
                )}
            </CardContent>
        </Card>
    );
}
