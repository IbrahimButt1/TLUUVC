
'use client';

import { useState, useMemo, useTransition } from 'react';
import type { Client } from '@/lib/clients';
import { deleteClient } from '@/lib/clients';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ClientsList from './clients-list';
import { CardHeader, CardTitle, CardContent } from '../ui/card';

export default function ClientsListClient({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState(initialClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = (clientId: string) => {
    startTransition(async () => {
        const originalClients = clients;
        setClients(currentClients => currentClients.filter(c => c.id !== clientId));
        
        const formData = new FormData();
        formData.append('id', clientId);

        try {
            await deleteClient(formData);
            toast({
                title: "Client moved to recycle bin",
            });
        } catch (error) {
            setClients(originalClients);
            toast({
                title: "Error",
                description: "Failed to move client to recycle bin. Please try again.",
                variant: "destructive",
            });
        }
    });
  };

  const filteredClients = useMemo(() => {
    if (!searchTerm) {
      return clients;
    }
    return clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  return (
    <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Existing Clients</CardTitle>
            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search clients..."
                    className="w-full md:w-80 bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
            <ClientsList 
                clients={filteredClients} 
                searchTerm={searchTerm} 
                onDelete={handleDelete}
                isPending={isPending}
            />
        </CardContent>
    </Card>
  );
}
