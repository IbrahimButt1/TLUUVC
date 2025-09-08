
'use client';

import { useState, useEffect } from 'react';
import TrafficByCountryChart from "@/components/admin/traffic-by-country-chart";
import TrafficByCityChart from "@/components/admin/traffic-by-city-chart";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Label } from '@/components/ui/label';

const WIDGETS = {
  services: { id: 'services', title: 'Manage Services' },
  trafficCountry: { id: 'trafficCountry', title: 'Traffic by Country' },
  trafficCity: { id: 'trafficCity', title: 'Traffic by City' },
};

type WidgetId = keyof typeof WIDGETS;

const DEFAULT_WIDGETS: WidgetId[] = ['services', 'trafficCountry', 'trafficCity'];

export default function AdminDashboard() {
  const [visibleWidgets, setVisibleWidgets] = useState<WidgetId[]>([]);
  const [isClient, setIsClient] = useState(false);

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
            <Link href="/admin/services">
                <Card className="hover:bg-muted transition-colors">
                <CardHeader>
                    <CardTitle>Manage Services</CardTitle>
                    <CardDescription>
                    Add, edit, or delete your service offerings.
                    </CardDescription>
                </CardHeader>
                </Card>
            </Link>
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
