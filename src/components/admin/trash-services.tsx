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
import type { Service } from "@/lib/services";
import { Loader2, Trash2, Undo } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type IconName = keyof typeof LucideIcons;
const DefaultIcon = LucideIcons.FileText;

interface TrashServicesProps {
    services: Service[];
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
        <Button variant="outline" size="sm" type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isPending && <Undo className="mr-2 h-4 w-4" />}
            Restore
        </Button>
    )
}

export default function TrashServices({ services, searchTerm, onRestore, onDelete, isPending }: TrashServicesProps) {
    return (
        <Card>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[350px]">Service</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
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
                                            <div className="font-medium">{service.title}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-md">
                                        <p className="truncate text-muted-foreground">{service.description}</p>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <form className="inline-block" action={() => onRestore(service.id)}>
                                            <RestoreButton isPending={isPending} />
                                        </form>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm" disabled={isPending}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Permanently
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete this service.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <form action={() => onDelete(service.id)}>
                                                        <DeleteConfirmationButton isPending={isPending} />
                                                    </form>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                {services.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                        <p>No services in the trash.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}