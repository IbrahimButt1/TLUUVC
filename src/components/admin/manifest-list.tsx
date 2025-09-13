
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ManifestEntry } from "@/lib/manifest";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ManifestListProps {
    entries: ManifestEntry[];
}


export default function ManifestList({ entries }: ManifestListProps) {
    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">Date</TableHead>
                        <TableHead className="w-[200px]">Client Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[120px]">Transaction ID</TableHead>
                        <TableHead className="w-[120px] text-center">Type</TableHead>
                        <TableHead className="w-[120px] text-right">Amount</TableHead>
                        <TableHead className="w-[120px] text-center">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {entries.map((entry) => (
                        <TableRow key={entry.id} className={cn(entry.status === 'inactive' && 'bg-muted/30 text-muted-foreground')}>
                            <TableCell>{format(new Date(entry.date), "MMM d, yyyy")}</TableCell>
                            <TableCell className="font-medium">{entry.clientName}</TableCell>
                            <TableCell>{entry.description}</TableCell>
                            <TableCell><code className="text-xs">{entry.id}</code></TableCell>
                            <TableCell className="text-center">
                                <Badge variant={entry.type === 'credit' ? 'default' : 'destructive'} 
                                       className={cn(
                                         "border-transparent",
                                         entry.type === 'credit' ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/50 dark:text-green-300" : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300",
                                         entry.status === 'inactive' && 'opacity-60'
                                       )}>
                                    {entry.type}
                                </Badge>
                            </TableCell>
                            <TableCell className={cn("text-right font-mono",
                                entry.type === 'credit' ? 'text-green-600' : 'text-red-600',
                                entry.status === 'inactive' && 'opacity-60'
                            )}>
                                {entry.type === 'credit' ? '+' : '-'}${entry.amount.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center">
                                 <Badge variant={entry.status === 'active' ? 'secondary' : 'outline'}
                                        className={cn(
                                            entry.status === 'active' ? "border-green-600/50 text-green-700 dark:text-green-400" : "text-muted-foreground"
                                        )}
                                 >
                                    {entry.status === 'active' ? 'Released' : 'Closed'}
                                </Badge>
                            </TableCell>
                        </TableRow>
                     ))}
                </TableBody>
            </Table>
            {entries.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                    <p>No manifest entries have been added yet.</p>
                </div>
            )}
        </div>
    );
}
