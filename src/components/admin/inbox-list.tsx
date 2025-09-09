import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import type { Email } from "@/lib/emails";
import type { GroupedEmails } from "./inbox-client";
import React, { useState, useEffect } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Loader2, Trash2 } from "lucide-react";
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

interface DeleteButtonProps {
    isPending: boolean;
}

function DeleteConfirmationButton({isPending}: DeleteButtonProps) {
    return (
        <Button type="submit" disabled={isPending}>
             {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
        </Button>
    )
}

function EmailGroup({ title, emails, searchTerm, isClient, onDelete, isPending }: { title: string; emails: Email[]; searchTerm: string, isClient: boolean, onDelete: (id: string) => void, isPending: boolean }) {
    if (emails.length === 0) return null;
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <>
            <div className="flex items-center gap-4 px-4 py-1">
                <Separator className="flex-1" />
                <h3 className="text-xs font-semibold text-muted-foreground">{title}</h3>
                <Separator className="flex-1" />
            </div>
            {emails.map((email) => (
                <AccordionItem value={email.id} key={email.id} className="border-b">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 rounded-md transition-colors data-[state=open]:bg-muted">
                        <div className="flex justify-between w-full items-center">
                            <div className={cn("flex flex-col text-left", !email.read && "font-bold")}>
                                <span className="font-medium text-sm">
                                    <HighlightedText text={email.name} highlight={searchTerm} />
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    <HighlightedText text={email.subject} highlight={searchTerm} />
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0 ml-4">
                                {isClient ? format(new Date(email.receivedAt), "PPp") : ''}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                        <div className="space-y-4 bg-muted/50 p-4 rounded-md">
                            <p className="text-sm"><strong>From:</strong> <a href={`mailto:${email.email}`} className="text-primary hover:underline"><HighlightedText text={email.email} highlight={searchTerm} /></a></p>
                            <p className="text-sm"><strong>Subject:</strong> <HighlightedText text={email.subject} highlight={searchTerm} /></p>
                            <div>
                                <p className="text-sm font-semibold mb-2">Message Received:</p>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                    <HighlightedText text={email.message} highlight={searchTerm} />
                                </p>
                            </div>
                            <div className="flex justify-end pt-2">
                                <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Move to Trash
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will move the email to the trash. You can permanently delete it from there.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <form action={() => {
                                                onDelete(email.id);
                                                setOpenDialog(false);
                                            }}>
                                                <input type="hidden" name="id" value={email.id} />
                                                <DeleteConfirmationButton isPending={isPending}/>
                                            </form>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </>
    );
}

export default function InboxList({ groupedEmails, searchTerm, onDelete, isPending }: { groupedEmails: GroupedEmails, searchTerm: string, onDelete: (id: string) => void, isPending: boolean }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const hasEmails = Object.values(groupedEmails).some(group => group.length > 0);

    return (
        <Card className="border shadow-sm">
            <CardContent className="p-0">
                {!hasEmails ? (
                    <p className="p-6 text-center text-muted-foreground">No emails found matching your search.</p>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                        <EmailGroup title="Today" emails={groupedEmails.today} searchTerm={searchTerm} isClient={isClient} onDelete={onDelete} isPending={isPending} />
                        <EmailGroup title="Yesterday" emails={groupedEmails.yesterday} searchTerm={searchTerm} isClient={isClient} onDelete={onDelete} isPending={isPending} />
                        <EmailGroup title="Last 7 Days" emails={groupedEmails.last7Days} searchTerm={searchTerm} isClient={isClient} onDelete={onDelete} isPending={isPending} />
                        <EmailGroup title="Older" emails={groupedEmails.older} searchTerm={searchTerm} isClient={isClient} onDelete={onDelete} isPending={isPending} />
                    </Accordion>
                )}
            </CardContent>
        </Card>
    );
}
