
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
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
import type { Client, ClientStatus } from "@/lib/clients";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Trash2, Loader2, User, Power, PowerOff, BookOpen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

interface ClientsListProps {
    clients: Client[];
    searchTerm: string;
    onDelete: (id: string) => void;
    onUpdateStatus: (id: string, newStatus: ClientStatus) => void;
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
            Move to Recycle Bin
        </Button>
    )
}

const statusConfig: Record<ClientStatus, { label: string; className: string }> = {
    planned: { label: 'Planned', className: 'border-blue-600/50 text-blue-700 dark:text-blue-400' },
    released: { label: 'Released', className: 'border-green-600/50 text-green-700 dark:text-green-400' },
    closed: { label: 'Closed', className: 'text-muted-foreground' },
    trash: { label: 'Trash', className: ''},
};

export default function ClientsList({ clients, searchTerm, onDelete, onUpdateStatus, isPending }: ClientsListProps) {
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Client Name</TableHead>
                        <TableHead>Client ID</TableHead>
                        <TableHead>Date Added</TableHead>
                        <TableHead className="w-[200px] text-center">Status</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                         <TableRow key={client.id} className={cn(client.status === 'closed' && 'bg-muted/30 text-muted-foreground')}>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <div className="bg-muted p-3 rounded-full">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="font-medium">
                                        <HighlightedText text={client.name} highlight={searchTerm} />
                                    </div>
                                </div>
                            </TableCell>
                             <TableCell>
                                <code className="text-muted-foreground">{client.id}</code>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {format(new Date(client.createdAt), 'PP')}
                            </TableCell>
                            <TableCell className="text-center">
                                <Select
                                    value={client.status}
                                    onValueChange={(newStatus) => onUpdateStatus(client.id, newStatus as ClientStatus)}
                                    disabled={isPending}
                                >
                                    <SelectTrigger className={cn("h-8 border-dashed", statusConfig[client.status]?.className)}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(statusConfig).filter(s => s !== 'trash').map(status => (
                                            <SelectItem key={status} value={status}>
                                                <span className={cn(statusConfig[status as ClientStatus]?.className)}>
                                                    {statusConfig[status as ClientStatus]?.label}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                            </TableCell>
                            <TableCell className="text-right">
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/ledger/${client.id}`}>
                                                <BookOpen className="mr-2 h-4 w-4" />
                                                View Ledger
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <AlertDialog open={openDialogId === client.id} onOpenChange={(isOpen) => setOpenDialogId(isOpen ? client.id : null)}>
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
                                                        This will move the client to the recycle bin. You can restore them later.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <form action={() => {
                                                        onDelete(client.id)
                                                        setOpenDialogId(null);
                                                    }}>
                                                        <input type="hidden" name="id" value={client.id} />
                                                        <DeleteConfirmationButton isPending={isPending} />
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
            {clients.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                    <p>No clients found. Add a new client using the form above.</p>
                </div>
            )}
        </div>
    );
}
