'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Client, type ClientBalance, updateClientBalance } from "@/lib/client-balances";
import ClientBalanceTableRow from "./client-balance-table-row";

interface ClientBalancesTableProps {
    clients: Client[];
    allBalances: ClientBalance[];
}

export default function ClientBalancesTable({ clients, allBalances }: ClientBalancesTableProps) {
    
    if (clients.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-12">
                <p>No clients found. Add a transaction in the 'Manifest' module to see clients listed here.</p>
            </div>
        )
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/4">Client Name</TableHead>
                        <TableHead className="w-1/4 text-center">Current Balance</TableHead>
                        <TableHead className="w-1/4">New Balance Amount</TableHead>
                        <TableHead className="w-1/4">Type</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="contents">
                    {clients.map(client => {
                        const balance = allBalances.find(b => b.clientName === client.name);
                        return (
                           <ClientBalanceTableRow 
                                key={client.name}
                                clientName={client.name}
                                currentBalance={balance}
                                action={updateClientBalance}
                           />
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
