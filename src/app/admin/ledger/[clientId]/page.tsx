import { getManifestEntriesByClientId } from "@/lib/manifest";
import { getClientById } from "@/lib/clients";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import ManifestList from "@/components/admin/manifest-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ClientLedgerPage({ params }: { params: { clientId: string } }) {
    const clientId = params.clientId;
    const client = await getClientById(clientId);
    const entries = await getManifestEntriesByClientId(clientId);

    if (!client) {
        notFound();
    }
    
    const totals = entries.filter(e => e.status === 'active').reduce((acc, entry) => {
        if (entry.type === 'debit') {
            acc.debit += entry.amount;
        } else {
            acc.credit += entry.amount;
        }
        return acc;
    }, { debit: 0, credit: 0 });

    const balance = totals.credit - totals.debit;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Ledger for {client.name}</h1>
                    <p className="text-muted-foreground">A complete transaction history for this client.</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/admin/client-balances">
                       <ArrowLeft className="mr-2 h-4 w-4" />
                       Back to Client Management
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Credit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">${totals.credit.toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Debit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-600">${totals.debit.toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Net Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${balance.toFixed(2)}
                        </p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>All recorded transactions for {client.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ManifestList entries={entries} />
                </CardContent>
            </Card>
        </div>
    );
}