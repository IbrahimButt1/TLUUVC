'use client';

import { useState, useTransition } from 'react';
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
import type { HeroImage } from "@/lib/hero-images";
import { Loader2, Trash2, Undo, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TrashHeroImagesProps {
    images: HeroImage[];
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

export default function TrashHeroImages({ images, searchTerm, onRestore, onDelete, isPending }: TrashHeroImagesProps) {
    
    return (
        <Card>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {images.map((image) => (
                            <TableRow key={image.id}>
                                <TableCell>
                                    <div className="relative w-32 h-20 rounded-md overflow-hidden border">
                                        <Image src={image.image} alt={image.title} fill className="object-cover" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium">{image.title}</p>
                                    <p className="text-sm text-muted-foreground truncate max-w-md">{image.description}</p>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <form className="inline-block" action={() => onRestore(image.id)}>
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
                                                    This action cannot be undone. This will permanently delete this hero image.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <form action={() => onDelete(image.id)}>
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
                {images.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                        <p>No hero images in the recycle bin.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
