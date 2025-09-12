'use client';

import type { Client, ClientBalance } from '@/lib/client-balances';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ClientBalanceForm from './client-balance-form';

interface ClientBalancesClientProps {
    initialClients: Client[];
    initialBalances: ClientBalance[];
}

export default function ClientBalancesClient({ initialClients, initialBalances }: ClientBalancesClientProps) {

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                 <div className="space-y-1">
                    <CardTitle>Set Opening Balance</CardTitle>
                    <CardDescription>Select a client and set their opening balance. This will be the starting point for their transaction history.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <ClientBalanceForm clients={initialClients} balances={initialBalances} />
            </CardContent>
        </Card>
    );
}
