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
import { deleteTestimonial, type Testimonial } from "@/lib/testimonials";
import { DeleteButton } from "@/components/admin/delete-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export default function TestimonialsList({ testimonials, searchTerm }: { testimonials: Testimonial[], searchTerm: string }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>
                                        <HighlightedText text={testimonial.name} highlight={searchTerm} />
                                    </CardTitle>
                                    <CardDescription>
                                        <HighlightedText text={testimonial.destination} highlight={searchTerm} />
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground italic">
                            "<HighlightedText text={testimonial.testimonial} highlight={searchTerm} />"
                        </p>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/admin/testimonials/edit/${testimonial.id}`}>Edit</Link>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">Delete</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete this testimonial.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <form action={deleteTestimonial}>
                                            <input type="hidden" name="id" value={testimonial.id} />
                                            <DeleteButton />
                                        </form>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            ))}
             {testimonials.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12">
                    <p>No testimonials found. Try adjusting your search.</p>
                </div>
            )}
        </div>
    );
}
