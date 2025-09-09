import { getServiceById, type Service } from "@/lib/services";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
    const service = await getServiceById(params.id);

    if (!service) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen bg-secondary">
            <Header />
            <main className="flex-grow py-12 md:py-20">
                <div className="container">
                    <div className="mb-8">
                        <Button variant="outline" asChild>
                            <Link href="/#services">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to All Services
                            </Link>
                        </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{service.title}</h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {service.longDescription}
                            </p>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Key Requirements</CardTitle>
                                    <CardDescription>General requirements for a successful application.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {service.requirements?.map((req, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 shrink-0" />
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                         <div className="rounded-xl overflow-hidden shadow-lg sticky top-24">
                            <Image
                                src={service.image || "https://picsum.photos/800/600"}
                                alt={`Image for ${service.title}`}
                                data-ai-hint="visa travel"
                                width={800}
                                height={600}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}