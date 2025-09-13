import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getManifestEntries, type ManifestEntry } from "@/lib/manifest";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import ManifestChart from "@/components/admin/manifest-chart";
import ManifestClient from "@/components/admin/manifest-client";

export default async function ManifestPage() {
  const entries = await getManifestEntries();
  const activeEntries = entries.filter((entry) => entry.status === 'active');
  
  // Calculate totals based on active entries
  const totals = activeEntries.reduce((acc, entry) => {
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
            <h1 className="text-3xl font-bold">Client Manifest</h1>
            <Button asChild>
                <Link href="/admin/manifest/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Entry
                </Link>
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Financial Overview (Active Entries)</CardTitle>
                <CardDescription>A visual summary of your credits, debits, and running balance based on active transactions.</CardDescription>
            </CardHeader>
            <CardContent>
                <ManifestChart entries={activeEntries} />
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Total Credit</CardTitle>
                    <CardDescription>Sum of all active incoming amounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-green-600">${totals.credit.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total Debit</CardTitle>
                    <CardDescription>Sum of all active outgoing amounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-red-600">${totals.debit.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Net Balance</CardTitle>
                    <CardDescription>Credit minus Debit from active entries.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${balance.toFixed(2)}
                    </p>
                </CardContent>
            </Card>
        </div>
        
        <ManifestClient initialEntries={entries} />
    </div>
  );
}
