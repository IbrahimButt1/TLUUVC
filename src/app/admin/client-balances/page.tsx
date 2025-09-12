import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getUniqueClients, getClientBalances } from "@/lib/client-balances";
import ClientBalancesClient from "@/components/admin/client-balances-client";

export default async function ClientBalancesPage() {
    const clients = await getUniqueClients();
    const balances = await getClientBalances();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Client Opening Balances</h1>
            <ClientBalancesClient initialClients={clients} initialBalances={balances} />
        </div>
    );
}
