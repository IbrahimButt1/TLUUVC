
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";
import { getServices, type Service } from "@/lib/services";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type IconName = keyof typeof LucideIcons;

const DefaultIcon = LucideIcons.FileText;

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getServices().then(setServices);
    // Trigger animation after a short delay
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="services" className="py-12 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Expertise</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">We provide a full spectrum of visa consultation services to meet your unique needs.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = (LucideIcons[service.icon as IconName] as React.ElementType) || DefaultIcon;
            return (
              <div
                key={service.id}
                className={cn(
                  "transition-all duration-700 ease-out",
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card className="text-center h-full hover:shadow-xl hover:-translate-y-2 transition-transform duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-secondary p-4 rounded-full w-fit">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="mb-2 font-headline">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
