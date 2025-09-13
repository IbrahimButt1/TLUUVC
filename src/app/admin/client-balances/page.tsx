
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import ClientForm from "@/components/admin/client-form";
import ClientsListClient from "@/components/admin/clients-list-client";
import { addClient, getClients } from "@/lib/clients";

export default async function ManageClientsPage() {
    const clients = await getClients();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Clients</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Add New Client</CardTitle>
                    <CardDescription>Add a new client and set their opening balance. They will then be available for manifest entries.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ClientForm 
                        action={addClient}
                        existingClients={clients.map(c => c.name)}
                    />
                </CardContent>
            </Card>

            <ClientsListClient initialClients={clients} />
        </div>
    );
}
