'use client';

import { useState, useMemo } from 'react';
import type { Client, ClientBalance } from '@/lib/client-balances';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ClientBalancesTable from './client-balances-table';

interface ClientBalancesClientProps {
    initialClients: Client[];
    initialBalances: ClientBalance[];
}

export default function ClientBalancesClient({ initialClients, initialBalances }: ClientBalancesClientProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = useMemo(() => {
        if (!searchTerm) {
            return initialClients;
        }
        return initialClients.filter(client => 
            client.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [initialClients, searchTerm]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                 <div className="space-y-1">
                    <CardTitle>Manage Balances</CardTitle>
                    <CardDescription>Set or update the opening balance for each client. This balance will be the starting point for their transaction history.</CardDescription>
                </div>
                 <div className="relative w-full max-w-sm">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search clients..."
                        className="w-full bg-background pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ClientBalancesTable clients={filteredClients} allBalances={initialBalances} />
            </CardContent>
        </Card>
    );
}
