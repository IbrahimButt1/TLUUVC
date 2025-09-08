import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import type { Email } from "@/lib/emails";
import type { GroupedEmails } from "./inbox-client";
import React, { useState, useEffect } from "react";
import { Separator } from "../ui/separator";

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

function EmailGroup({ title, emails, searchTerm, isClient }: { title: string; emails: Email[]; searchTerm: string, isClient: boolean }) {
    if (emails.length === 0) return null;

    return (
        <>
            <div className="flex items-center gap-4 px-6 py-2">
                <Separator className="flex-1" />
                <h3 className="text-xs font-semibold text-muted-foreground">{title}</h3>
                <Separator className="flex-1" />
            </div>
            {emails.map((email) => (
                <AccordionItem value={email.id} key={email.id} className="border-b-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 rounded-md transition-colors data-[state=open]:bg-muted">
                        <div className="flex justify-between w-full items-center">
                            <div className={cn("flex flex-col text-left gap-1", !email.read && "font-bold")}>
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
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </>
    );
}

export default function InboxList({ groupedEmails, searchTerm }: { groupedEmails: GroupedEmails, searchTerm: string }) {
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
                        <EmailGroup title="Today" emails={groupedEmails.today} searchTerm={searchTerm} isClient={isClient} />
                        <EmailGroup title="Yesterday" emails={groupedEmails.yesterday} searchTerm={searchTerm} isClient={isClient} />
                        <EmailGroup title="Last 7 Days" emails={groupedEmails.last7Days} searchTerm={searchTerm} isClient={isClient} />
                        <EmailGroup title="Older" emails={groupedEmails.older} searchTerm={searchTerm} isClient={isClient} />
                    </Accordion>
                )}
            </CardContent>
        </Card>
    );
}
