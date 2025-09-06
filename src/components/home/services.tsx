import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { University, Briefcase, Users, FileText } from "lucide-react";

const services = [
  {
    icon: <University className="h-10 w-10 text-primary" />,
    title: "Student Visas",
    description: "Comprehensive guidance for students aspiring to study abroad, from application to approval."
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: "Work Visas",
    description: "Tailored support for professionals seeking employment opportunities in a new country."
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Family & Partner Visas",
    description: "Helping you reunite with your loved ones through dedicated family and partner visa services."
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Application Review",
    description: "Meticulous review of your visa application to maximize your chances of success."
  }
]

export default function Services() {
  return (
    <section id="services" className="py-12 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Expertise</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">We provide a full spectrum of visa consultation services to meet your unique needs.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title} className="text-center hover:shadow-xl hover:-translate-y-2 transition-transform duration-300">
              <CardHeader>
                <div className="mx-auto bg-secondary p-4 rounded-full w-fit">
                  {service.icon}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2 font-headline">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
