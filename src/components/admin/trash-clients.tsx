
'use client';

import { format } from 'date-fns';
import type { Client } from "@/lib/clients";
import { Button } from "../ui/button";
import { Trash2, Undo, Loader2, User } from "lucide-react";
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
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from '@/components/ui/table';
import { CardContent } from '../ui/card';

interface TrashClientsProps {
    clients: Client[];
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

function RestoreButton({ isPending, onRestore }: ActionButtonProps & { onRestore: () => void }) {
    return (
        <Button variant="outline" size="sm" type="button" onClick={onRestore} disabled={isPending} className="w-28 justify-center">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isPending && <Undo className="mr-1.5 h-4 w-4" />}
            Restore
        </Button>
    )
}

export default function TrashClients({ clients, searchTerm, onRestore, onDelete, isPending }: TrashClientsProps) {
    
    if (clients.length === 0 && !isPending) {
        return <CardContent><p className="p-6 text-center text-muted-foreground">The recycle bin for clients is empty.</p></CardContent>;
    }

    return (
        <CardContent className="p-0">
             <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>Client Name</TableHead>
                        <TableHead className="w-[200px]">Date Added</TableHead>
                        <TableHead className="w-[300px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client.id}>
                            <TableCell className="py-2 px-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <div className="font-semibold">{client.name}</div>
                                </div>
                            </TableCell>
                             <TableCell className="py-2 px-4 text-sm text-muted-foreground">
                                {format(new Date(client.createdAt), "PPP")}
                            </TableCell>
                            <TableCell className="py-2 px-4 text-right space-x-2">
                                <RestoreButton isPending={isPending} onRestore={() => onRestore(client.id)} />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" disabled={isPending} className="w-40 justify-center">
                                            <Trash2 className="mr-1.5 h-4 w-4" />
                                            Delete Permanently
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete this client and all associated data.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <form action={() => onDelete(client.id)}>
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
        </CardContent>
    );
}
