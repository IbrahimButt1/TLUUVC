import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import { deleteService, type Service } from "@/lib/services";
import { DeleteButton } from "@/components/admin/delete-button";
import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;
const DefaultIcon = LucideIcons.FileText;

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
                    <span key={i} className="bg-yellow-200 text-black rounded-sm px-0.5">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </span>
    );
}

export default function ServicesList({ services, searchTerm }: { services: Service[], searchTerm: string }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
                const Icon = (LucideIcons[service.icon as IconName] as React.ElementType) || DefaultIcon;
                return (
                    <Card key={service.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-muted p-3 rounded-md">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>
                                        <HighlightedText text={service.title} highlight={searchTerm} />
                                    </CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CardDescription>
                                <HighlightedText text={service.description} highlight={searchTerm} />
                            </CardDescription>
                            <div className="text-sm text-muted-foreground">
                                Icon: <code><HighlightedText text={service.icon} highlight={searchTerm} /></code>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/admin/services/edit/${service.id}`}>Edit</Link>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete this service.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <form action={deleteService}>
                                                <input type="hidden" name="id" value={service.id} />
                                                <DeleteButton />
                                            </form>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
             {services.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12">
                    <p>No services found. Try adjusting your search.</p>
                </div>
            )}
        </div>
    );
}
