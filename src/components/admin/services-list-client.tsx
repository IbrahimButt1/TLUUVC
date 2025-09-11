'use client';

import { useState, useMemo } from 'react';
import type { Service } from '@/lib/services';
import ServicesList from './services-list';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ServicesListClient({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = useMemo(() => {
    if (!searchTerm) {
      return services;
    }
    return services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.icon.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [services, searchTerm]);

  return (
    <div>
       <div className="mb-6">
         <Card className="shadow-none">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search services..."
                    className="w-full bg-card pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </Card>
      </div>
      <ServicesList services={filteredServices} searchTerm={searchTerm} />
    </div>
  );
}
