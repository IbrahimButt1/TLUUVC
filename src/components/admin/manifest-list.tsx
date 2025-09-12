'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ManifestEntry } from "@/lib/manifest";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ManifestList({ entries }: { entries: ManifestEntry[]}) {
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {entries.map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell className="text-muted-foreground">{format(new Date(entry.date), "MMM d, yyyy")}</TableCell>
                            <TableCell className="font-medium">{entry.clientName}</TableCell>
                            <TableCell className="text-muted-foreground">{entry.description}</TableCell>
                            <TableCell><code className="text-xs text-muted-foreground">{entry.id}</code></TableCell>
                            <TableCell className="text-center">
                                <Badge variant={entry.type === 'credit' ? 'default' : 'destructive'} 
                                       className={cn(
                                         entry.type === 'credit' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                       )}>
                                    {entry.type}
                                </Badge>
                            </TableCell>
                            <TableCell className={cn("text-right font-mono",
                                entry.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            )}>
                                {entry.type === 'credit' ? '+' : '-'}${entry.amount.toFixed(2)}
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
