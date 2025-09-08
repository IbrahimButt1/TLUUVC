import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import type { Email } from "@/lib/emails";
import React, { useState, useEffect } from "react";

function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
    if (!highlight.trim()) {
        return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <span key={i} className="bg-yellow-200 text-black">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </span>
    );
}


export default function InboxList({ emails, searchTerm }: { emails: Email[], searchTerm: string }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <Card>
            <CardContent className="p-0">
                {emails.length === 0 ? (
                    <p className="p-6 text-muted-foreground">No emails found.</p>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                        {emails.map((email) => (
                            <AccordionItem value={email.id} key={email.id}>
                                <AccordionTrigger className="p-6 hover:no-underline">
                                    <div className="flex justify-between w-full items-center">
                                        <div className={cn("flex flex-col text-left", !email.read && "font-bold")}>
                                            <span className="font-medium">
                                                <HighlightedText text={email.name} highlight={searchTerm} />
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                <HighlightedText text={email.subject} highlight={searchTerm} />
                                            </span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {isClient ? format(new Date(email.receivedAt), "PPpp") : ''}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-6 pt-0">
                                    <div className="space-y-4">
                                        <p><strong>From:</strong> <HighlightedText text={email.email} highlight={searchTerm} /></p>

                                        <p className="whitespace-pre-wrap bg-muted p-4 rounded-md">
                                            <HighlightedText text={email.message} highlight={searchTerm} />
                                        </p>
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
