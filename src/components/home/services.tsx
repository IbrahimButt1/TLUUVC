
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";
import { getServices, type Service } from "@/lib/services";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
                <Link href={`/services/${service.id}`} className="group h-full flex">
                    <Card className="text-center h-full hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col w-full">
                    <CardHeader>
                        <div className="mx-auto bg-secondary p-4 rounded-full w-fit transition-colors group-hover:bg-primary/10">
                        <Icon className="h-10 w-10 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow">
                        <CardTitle className="mb-2 font-headline">{service.title}</CardTitle>
                        <CardDescription className="flex-grow">{service.description}</CardDescription>
                         <div className="mt-4 flex items-center justify-center text-primary font-semibold">
                            <span>Learn More</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </CardContent>
                    </Card>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
