import { getEmails } from "@/lib/emails";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from 'date-fns';

export default async function InboxPage() {
    const emails = await getEmails();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Email Inbox</h1>
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
                                            <div className="flex flex-col text-left">
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
        </div>
    );
}
