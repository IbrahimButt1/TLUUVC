import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getUniqueClients, getClientBalances, updateClientBalance } from "@/lib/client-balances";
import ClientBalanceForm from "@/components/admin/client-balance-form";

export default async function ClientBalancesPage() {
    const clients = await getUniqueClients();
    const balances = await getClientBalances();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Client Opening Balances</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Balances</CardTitle>
                    <CardDescription>Set or update the opening balance for each client. This balance will be the starting point for their transaction history.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {clients.map(client => {
                            const balance = balances.find(b => b.clientName === client.name);
                            return (
                                <ClientBalanceForm 
                                    key={client.name}
                                    clientName={client.name}
                                    currentBalance={balance}
                                    action={updateClientBalance}
                                />
                            )
                        })}

                        {clients.length === 0 && (
                            <div className="text-center text-muted-foreground py-8">
                                <p>No clients found in your manifest. Add a transaction in the 'Manifest' module to see clients listed here.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
