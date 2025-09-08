import { getEmails } from "@/lib/emails";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

export default async function InboxList() {
    const emails = await getEmails();

    return (
        <Card>
            <CardContent className="p-0">
                {emails.length === 0 ? (
                    <p className="p-6 text-muted-foreground">Your inbox is empty.</p>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                        {emails.map((email) => (
                            <AccordionItem value={email.id} key={email.id}>
                                <AccordionTrigger className="p-6 hover:no-underline">
                                    <div className="flex justify-between w-full items-center">
                                        <div className={cn("flex flex-col text-left", !email.read && "font-bold")}>
                                            <span className="font-medium">{email.name}</span>
                                            <span className="text-sm text-muted-foreground">{email.subject}</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {format(new Date(email.receivedAt), "PPpp")}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-6 pt-0">
                                    <div className="space-y-4">
                                        <p><strong>From:</strong> {email.email}</p>
                                        <p className="whitespace-pre-wrap bg-muted p-4 rounded-md">{email.message}</p>
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
