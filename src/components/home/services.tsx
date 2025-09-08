import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { University, Briefcase, Users, FileText, LucideIcon } from "lucide-react";
import { getServices } from "@/lib/services";

const iconMap: { [key: string]: LucideIcon } = {
  "student-visas": University,
  "work-visas": Briefcase,
  "family-partner-visas": Users,
  "application-review": FileText,
};

const DefaultIcon = FileText;

export default async function Services() {
  const services = await getServices();
  return (
    <section id="services" className="py-12 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Expertise</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">We provide a full spectrum of visa consultation services to meet your unique needs.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = iconMap[service.id] || DefaultIcon;
            return (
              <Card key={service.id} className="text-center hover:shadow-xl hover:-translate-y-2 transition-transform duration-300">
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
