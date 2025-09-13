
'use client';

import { useState, useMemo, useTransition, useEffect } from 'react';
import type { Client, ClientStatus } from '@/lib/clients';
import { addClient, deleteClient, updateClientStatus } from '@/lib/clients';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ClientsList from './clients-list';
import ClientForm from './client-form';
import { CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

export default function ClientsListClient({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState(initialClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAddClient = (newClient: Client) => {
    setClients(currentClients => [newClient, ...currentClients]);
  };

  const handleDelete = (clientId: string) => {
    startTransition(async () => {
        const originalClients = clients;
        // Optimistic update: remove from the list
        setClients(currentClients => currentClients.filter(c => c.id !== clientId));
        
        const formData = new FormData();
        formData.append('id', clientId);

        try {
            await deleteClient(formData);
            toast({
                title: "Client moved to recycle bin",
            });
        } catch (error) {
            // Revert on error
            setClients(originalClients);
            toast({
                title: "Error",
                description: "Failed to move client to recycle bin. Please try again.",
                variant: "destructive",
            });
        }
    });
  };

  const handleUpdateStatus = (id: string, newStatus: ClientStatus) => {
    startTransition(async () => {
      const originalClients = [...clients];
      const clientIndex = originalClients.findIndex(c => c.id === id);
      if (clientIndex === -1) return;
      
      // Optimistic update
      setClients(current => current.map(e => e.id === id ? { ...e, status: newStatus } : e));
      
      const formData = new FormData();
      formData.append('id', id);
      formData.append('status', newStatus);

      try {
        const result = await updateClientStatus(formData);
        if (result.success) {
           setClients(current => current.map(e => e.id === id ? { ...e, status: newStatus } : e));
           toast({
            title: "Status Updated",
            description: `Client status changed to ${newStatus}.`,
          });
        } else {
          // Revert on error
          setClients(originalClients);
          toast({ title: "Error", description: result.error, variant: "destructive" });
        }
      } catch (error) {
        setClients(originalClients);
        toast({ title: "Error", description: "Failed to update status. Please try again.", variant: "destructive" });
      }
    });
  };

  const filteredClients = useMemo(() => {
    let tabFiltered = clients;
     if (activeTab === 'planned') {
      tabFiltered = clients.filter(c => c.status === 'planned');
    } else if (activeTab === 'released') {
      tabFiltered = clients.filter(c => c.status === 'released');
    } else if (activeTab === 'closed') {
      tabFiltered = clients.filter(c => c.status === 'closed');
    }


    if (!searchTerm) {
      return tabFiltered;
    }

    return tabFiltered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm, activeTab]);

  return (
    <>
      <Card>
          <CardHeader>
              <CardTitle>Add New Client</CardTitle>
              <CardDescription>Add a new client and optionally set their opening balance. New clients start with a 'Planned' status.</CardDescription>
          </CardHeader>
          <CardContent>
              <ClientForm 
                  action={addClient}
                  onClientAdded={handleAddClient}
              />
          </CardContent>
      </Card>
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle>Existing Clients</CardTitle>
                <CardDescription>View, search, and manage your clients' lifecycle.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
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
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="planned">Planned</TabsTrigger>
                  <TabsTrigger value="released">Released</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>
              </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="all" className="m-0"></TabsContent>
            <TabsContent value="planned" className="m-0"></TabsContent>
            <TabsContent value="released" className="m-0"></TabsContent>
            <TabsContent value="closed" className="m-0"></TabsContent>
              <ClientsList 
                  clients={filteredClients} 
                  searchTerm={searchTerm} 
                  onDelete={handleDelete}
                  onUpdateStatus={handleUpdateStatus}
                  isPending={isPending}
              />
          </CardContent>
        </Tabs>
      </Card>
    </>
  );
}
