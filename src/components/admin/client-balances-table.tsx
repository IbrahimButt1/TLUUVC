'use client';

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
            {/* Header */}
            <div className="grid grid-cols-[1fr,1fr,1fr,1fr,auto] gap-4 p-4 border-b bg-muted/50 font-medium text-muted-foreground text-sm">
                <div>Client Name</div>
                <div className="text-center">Current Balance</div>
                <div>New Balance Amount</div>
                <div>Type</div>
                <div className="text-right">Action</div>
            </div>
            {/* Body */}
            <div>
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
            </div>
        </div>
    );
}
