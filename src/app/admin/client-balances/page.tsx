

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import ClientsListClient from "@/components/admin/clients-list-client";
import { getClients } from "@/lib/clients";

export default async function ManageClientsPage() {
    const clients = await getClients();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Clients</h1>
            
            <ClientsListClient initialClients={clients} />
        </div>
    );
}
