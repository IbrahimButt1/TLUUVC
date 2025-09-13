
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
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
import type { Client } from "@/lib/clients";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Trash2, Loader2, User, Power, PowerOff } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface ClientsListProps {
    clients: Client[];
    searchTerm: string;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, currentStatus: 'active' | 'inactive') => void;
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

export default function ClientsList({ clients, searchTerm, onDelete, onToggleStatus, isPending }: ClientsListProps) {
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Client Name</TableHead>
                        <TableHead>Client ID</TableHead>
                        <TableHead>Date Added</TableHead>
                        <TableHead className="w-[120px] text-center">Status</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                         <TableRow key={client.id} className={cn(client.status === 'inactive' && 'bg-muted/30 text-muted-foreground')}>
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
                                 <Badge variant={client.status === 'active' ? 'secondary' : 'outline'}
                                        className={cn(
                                            client.status === 'active' ? "border-green-600/50 text-green-700 dark:text-green-400" : "text-muted-foreground"
                                        )}
                                 >
                                    {client.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onToggleStatus(client.id, client.status || 'active')}>
                                            {client.status === 'active' ? (
                                                <><PowerOff className="mr-2 h-4 w-4 text-destructive" /><span>Deactivate</span></>
                                            ) : (
                                                <><Power className="mr-2 h-4 w-4 text-green-600" /><span>Activate</span></>
                                            )}
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
