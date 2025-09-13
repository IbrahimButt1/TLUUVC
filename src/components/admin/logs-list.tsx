
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { LogEntry } from "@/lib/logs";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function getActionBadgeVariant(action: string): "default" | "secondary" | "destructive" | "outline" {
  if (action.toLowerCase().includes('delete') || action.toLowerCase().includes('remove')) {
    return "destructive";
  }
  if (action.toLowerCase().includes('update') || action.toLowerCase().includes('edit') || action.toLowerCase().includes('restore')) {
    return "secondary";
  }
  if (action.toLowerCase().includes('add') || action.toLowerCase().includes('create') || action.toLowerCase().includes('login')) {
    return "default";
  }
  return "outline";
}


export default function LogsList({ logs }: { logs: LogEntry[]}) {
    return (
        <TooltipProvider>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Timestamp</TableHead>
                            <TableHead className="w-[250px]">Action</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="text-muted-foreground text-sm">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span>{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{format(new Date(log.timestamp), "PPP p")}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getActionBadgeVariant(log.action)}>
                                        {log.action}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{log.details}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {logs.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                        <p>No log entries found.</p>
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
}
