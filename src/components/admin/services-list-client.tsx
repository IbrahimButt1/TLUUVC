'use client';

import { useState, useMemo, useTransition } from 'react';
import type { Service } from '@/lib/services';
import { deleteService } from '@/lib/services';
import ServicesList from './services-list';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ServicesListClient({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = (serviceId: string) => {
    startTransition(async () => {
        const originalServices = services;
        setServices(currentServices => currentServices.filter(s => s.id !== serviceId));
        
        const formData = new FormData();
        formData.append('id', serviceId);

        try {
            await deleteService(formData);
            toast({
                title: "Service moved to recycle bin",
            });
        } catch (error) {
            setServices(originalServices);
            toast({
                title: "Error",
                description: "Failed to move service to recycle bin. Please try again.",
                variant: "destructive",
            });
        }
    });
  };

  const filteredServices = useMemo(() => {
    if (!searchTerm) {
      return services;
    }
    return services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.icon && service.icon.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [services, searchTerm]);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-end px-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search services..."
                className="w-full md:w-80 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>
      <ServicesList 
        services={filteredServices} 
        searchTerm={searchTerm} 
        onDelete={handleDelete}
        isPending={isPending}
      />
    </div>
  );
}
