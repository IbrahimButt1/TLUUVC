'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import type { Testimonial } from "@/lib/testimonials";
import { Loader2, Trash2, Undo } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


interface TrashTestimonialsProps {
    testimonials: Testimonial[];
    searchTerm: string;
    onRestore: (id: string) => void;
    onDelete: (id: string) => void;
    isPending: boolean;
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

export default function TrashTestimonials({ testimonials, searchTerm, onRestore, onDelete, isPending }: TrashTestimonialsProps) {

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
                                            <div className="font-medium">{testimonial.name}</div>
                                            <div className="text-sm text-muted-foreground">{testimonial.destination}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="text-muted-foreground italic truncate max-w-md">"{testimonial.testimonial}"</p>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <form className="inline-block" action={() => onRestore(testimonial.id)}>
                                        <RestoreButton isPending={isPending} />
                                    </form>
                                    <AlertDialog>
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
                                                    This action cannot be undone. This will permanently delete this testimonial.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <form action={() => onDelete(testimonial.id)}>
                                                    <DeleteConfirmationButton isPending={isPending} />
                                                </form>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {testimonials.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                        <p>No testimonials in the trash.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
