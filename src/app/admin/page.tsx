
'use client';

import { useState, useEffect } from 'react';
import TrafficByCountryChart from "@/components/admin/traffic-by-country-chart";
import TrafficByCityChart from "@/components/admin/traffic-by-city-chart";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LayoutDashboard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Label } from '@/components/ui/label';
import { getServices, Service } from '@/lib/services';
import * as LucideIcons from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type IconName = keyof typeof LucideIcons;
const DefaultIcon = LucideIcons.FileText;

const WIDGETS = {
  services: { id: 'services', title: 'Services Overview' },
  trafficCountry: { id: 'trafficCountry', title: 'Traffic by Country' },
  trafficCity: { id: 'trafficCity', title: 'Traffic by City' },
};

type WidgetId = keyof typeof WIDGETS;

const DEFAULT_WIDGETS: WidgetId[] = ['services', 'trafficCountry', 'trafficCity'];

export default function AdminDashboard() {
  const [visibleWidgets, setVisibleWidgets] = useState<WidgetId[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedWidgets = localStorage.getItem('dashboardWidgets');
      if (savedWidgets) {
        setVisibleWidgets(JSON.parse(savedWidgets));
      } else {
        setVisibleWidgets(DEFAULT_WIDGETS);
      }
    } catch (error) {
      console.error("Failed to parse widgets from localStorage", error);
      setVisibleWidgets(DEFAULT_WIDGETS);
    }
    
    // Fetch services on the client side
    getServices().then(setServices);
  }, []);

  const handleWidgetToggle = (widgetId: WidgetId) => {
    const newVisibleWidgets = visibleWidgets.includes(widgetId)
      ? visibleWidgets.filter(id => id !== widgetId)
      : [...visibleWidgets, widgetId];
    setVisibleWidgets(newVisibleWidgets);
    localStorage.setItem('dashboardWidgets', JSON.stringify(newVisibleWidgets));
  };
  
  if (!isClient) {
    return null; 
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Customize Layout
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Customize Dashboard Layout</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {Object.values(WIDGETS).map(widget => (
                        <div key={widget.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={widget.id}
                                checked={visibleWidgets.includes(widget.id as WidgetId)}
                                onCheckedChange={() => handleWidgetToggle(widget.id as WidgetId)}
                            />
                            <Label htmlFor={widget.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {widget.title}
                            </Label>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleWidgets.includes('services') && (
            <Card className="col-span-1 lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Services Overview</CardTitle>
                        <CardDescription>
                            A quick look at your current service offerings.
                        </CardDescription>
                    </div>
                     <Button asChild variant="outline" size="sm">
                        <Link href="/admin/services">
                            Manage All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {services.slice(0, 3).map((service, index) => {
                             const Icon = (LucideIcons[service.icon as IconName] as React.ElementType) || DefaultIcon;
                             return (
                                <div key={service.id} className="flex flex-col gap-4">
                                     <div className="flex items-start gap-4">
                                        <div className="bg-muted p-3 rounded-md">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{service.title}</p>
                                            <p className="text-sm text-muted-foreground">{service.description}</p>
                                        </div>
                                    </div>
                                    {index < 2 && <Separator className="lg:hidden" />}
                                </div>
                             )
                        })}
                         {services.length === 0 && <p className="text-sm text-muted-foreground">No services have been added yet.</p>}
                    </div>
                </CardContent>
            </Card>
        )}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {visibleWidgets.includes('trafficCountry') && (
            <Card>
            <CardHeader>
                <CardTitle>Traffic by Country</CardTitle>
                <CardDescription>Top countries visiting your website.</CardDescription>
            </CardHeader>
            <CardContent>
                <TrafficByCountryChart />
            </CardContent>
            </Card>
        )}
        {visibleWidgets.includes('trafficCity') && (
            <Card>
            <CardHeader>
                <CardTitle>Traffic by City</CardTitle>
                <CardDescription>Top cities visiting your website.</CardDescription>
            </CardHeader>
            <CardContent>
                <TrafficByCityChart />
            </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
