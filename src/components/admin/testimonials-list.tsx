import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import { deleteTestimonial, type Testimonial } from "@/lib/testimonials";
import { DeleteButton } from "@/components/admin/delete-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, FilePenLine, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

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
        <Card>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Client</TableHead>
                            <TableHead>Testimonial</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {testimonials.map((testimonial) => (
                            <TableRow key={testimonial.id}>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">
                                                <HighlightedText text={testimonial.name} highlight={searchTerm} />
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                <HighlightedText text={testimonial.destination} highlight={searchTerm} />
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="text-muted-foreground italic truncate max-w-md">
                                        "<HighlightedText text={testimonial.testimonial} highlight={searchTerm} />"
                                    </p>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/testimonials/edit/${testimonial.id}`} className="flex items-center">
                                                    <FilePenLine className="mr-2 h-4 w-4" />
                                                    <span>Edit</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem 
                                                        className="text-destructive focus:text-destructive flex items-center"
                                                        onSelect={(e) => e.preventDefault()}
                                                    >
                                                       <Trash2 className="mr-2 h-4 w-4" />
                                                       <span>Delete</span>
                                                    </DropdownMenuItem>
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
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {testimonials.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                        <p>No testimonials found. Try adjusting your search.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
