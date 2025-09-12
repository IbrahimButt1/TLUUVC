'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
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
import type { Service } from "@/lib/services";
import * as LucideIcons from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, FilePenLine, Trash2, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

type IconName = keyof typeof LucideIcons;
const DefaultIcon = LucideIcons.FileText;

interface ServicesListProps {
    services: Service[];
    searchTerm: string;
    onDelete: (id: string) => void;
    isPending: boolean;
}

function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
    if (!highlight || !text) {
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

function DeleteConfirmationButton({ isPending }: { isPending: boolean }) {
    return (
        <Button variant="destructive" type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
        </Button>
    )
}

export default function ServicesList({ services, searchTerm, onDelete, isPending }: ServicesListProps) {
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);

    return (
        <Card>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[350px]">Service</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[100px]">Icon</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => {
                            const Icon = (LucideIcons[service.icon as IconName] as React.ElementType) || DefaultIcon;
                            return (
                                <TableRow key={service.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-muted p-3 rounded-md">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="font-medium">
                                                <HighlightedText text={service.title} highlight={searchTerm} />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-md">
                                        <p className="truncate text-muted-foreground">
                                           <HighlightedText text={service.description} highlight={searchTerm} />
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-muted-foreground">
                                            <HighlightedText text={service.icon} highlight={searchTerm} />
                                        </code>
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
                                                    <Link href={`/admin/services/edit/${service.id}`} className="flex items-center">
                                                        <FilePenLine className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                 <AlertDialog open={openDialogId === service.id} onOpenChange={(isOpen) => setOpenDialogId(isOpen ? service.id : null)}>
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
                                                                This action cannot be undone. This will move this service to the trash.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <form action={() => {
                                                                onDelete(service.id)
                                                                setOpenDialogId(null);
                                                            }}>
                                                                <input type="hidden" name="id" value={service.id} />
                                                                <DeleteConfirmationButton isPending={isPending} />
                                                            </form>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                {services.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                        <p>No services found. Try adjusting your search or add a new one.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
