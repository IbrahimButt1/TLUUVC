'use client';

import { useState, useMemo, useTransition } from 'react';
import type { Email } from '@/lib/emails';
import type { HeroImage } from '@/lib/hero-images';
import type { Service } from '@/lib/services';
import type { Testimonial } from '@/lib/testimonials';
import { permanentlyDeleteEmail, restoreEmail } from '@/lib/emails';
import { permanentlyDeleteHeroImage, restoreHeroImage } from '@/lib/hero-images';
import { permanentlyDeleteService, restoreService } from '@/lib/services';
import { permanentlyDeleteTestimonial, restoreTestimonial } from '@/lib/testimonials';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import TrashEmails from './trash-emails';
import TrashHeroImages from './trash-hero-images';
import TrashServices from './trash-services';
import TrashTestimonials from './trash-testimonials';


interface TrashClientProps {
  initialEmails: Email[];
  initialHeroImages: HeroImage[];
  initialServices: Service[];
  initialTestimonials: Testimonial[];
}

export default function TrashClient({
  initialEmails,
  initialHeroImages,
  initialServices,
  initialTestimonials
}: TrashClientProps) {
  const [emails, setEmails] = useState(initialEmails || []);
  const [heroImages, setHeroImages] = useState(initialHeroImages || []);
  const [services, setServices] = useState(initialServices || []);
  const [testimonials, setTestimonials] = useState(initialTestimonials || []);

  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAction = <T extends {id: string}>(
    action: (formData: FormData) => Promise<{ success: boolean; error?: string }>,
    itemId: string,
    itemType: 'email' | 'heroImage' | 'service' | 'testimonial',
    successMessage: string
  ) => {
    startTransition(async () => {
      // Optimistically update the UI
      const originalItems = {
        email: [...emails],
        heroImage: [...heroImages],
        service: [...services],
        testimonial: [...testimonials]
      };
      
      const setStateMap = {
        email: setEmails,
        heroImage: setHeroImages,
        service: setServices,
        testimonial: setTestimonials
      };

      const setState = setStateMap[itemType];
      // @ts-ignore
      setState((currentItems: T[]) => currentItems.filter(item => item.id !== itemId));
      
      const formData = new FormData();
      formData.append('id', itemId);

      try {
        const result = await action(formData);
        if (result.success) {
            toast({ title: successMessage });
        } else {
            // @ts-ignore
            setState(originalItems[itemType]);
            toast({ title: "Error", description: result.error || "An unknown error occurred", variant: "destructive" });
        }
      } catch (error) {
        // @ts-ignore
        setState(originalItems[itemType]); 
        const errorMessage = error instanceof Error ? error.message : "Failed to perform action. Please try again.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };

  const filteredEmails: Email[] = useMemo(() => {
    return searchTerm
      ? emails.filter(email =>
          email.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.message.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : emails;
  }, [emails, searchTerm]);
  
  const filteredHeroImages = useMemo(() => (
    searchTerm ? heroImages.filter(img => 
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        img.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) : heroImages
  ), [heroImages, searchTerm]);

  const filteredServices = useMemo(() => (
    searchTerm ? services.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) : services
  ), [services, searchTerm]);

  const filteredTestimonials = useMemo(() => (
    searchTerm ? testimonials.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.testimonial.toLowerCase().includes(searchTerm.toLowerCase())
    ) : testimonials
  ), [testimonials, searchTerm]);


  return (
    <div className="space-y-6">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
            type="search"
            placeholder="Search all trashed items..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      
        {isPending && (
            <div className="flex items-center justify-center py-4 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Processing...</span>
            </div>
        )}

        <Tabs defaultValue="emails" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="emails">Emails ({filteredEmails.length})</TabsTrigger>
                <TabsTrigger value="hero-images">Hero Images ({filteredHeroImages.length})</TabsTrigger>
                <TabsTrigger value="services">Services ({filteredServices.length})</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials ({filteredTestimonials.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="emails">
                <Card>
                    <CardHeader>
                        <CardTitle>Trashed Emails</CardTitle>
                        <CardDescription>Emails that have been moved to the trash. Restore them or delete them permanently.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TrashEmails 
                            emails={filteredEmails} 
                            searchTerm={searchTerm} 
                            onRestore={(id) => handleAction(restoreEmail, id, 'email', "Email restored.")}
                            onDelete={(id) => handleAction(permanentlyDeleteEmail, id, 'email', "Email permanently deleted.")}
                            isPending={isPending}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="hero-images">
                 <Card>
                    <CardHeader>
                        <CardTitle>Trashed Hero Images</CardTitle>
                        <CardDescription>Hero images that have been moved to the trash. Restore them or delete them permanently.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TrashHeroImages
                            images={filteredHeroImages}
                            searchTerm={searchTerm}
                            onRestore={(id) => handleAction(restoreHeroImage, id, 'heroImage', "Hero Image restored.")}
                            onDelete={(id) => handleAction(permanentlyDeleteHeroImage, id, 'heroImage', "Hero Image permanently deleted.")}
                            isPending={isPending}
                            />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="services">
                <Card>
                    <CardHeader>
                        <CardTitle>Trashed Services</CardTitle>
                        <CardDescription>Services that have been moved to the trash. Restore them or delete them permanently.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TrashServices
                            services={filteredServices}
                            searchTerm={searchTerm}
                            onRestore={(id) => handleAction(restoreService, id, 'service', "Service restored.")}
                            onDelete={(id) => handleAction(permanentlyDeleteService, id, 'service', "Service permanently deleted.")}
                            isPending={isPending}
                            />
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="testimonials">
                <Card>
                    <CardHeader>
                        <CardTitle>Trashed Testimonials</CardTitle>
                        <CardDescription>Testimonials that have been moved to the trash. Restore them or delete them permanently.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TrashTestimonials
                            testimonials={filteredTestimonials}
                            searchTerm={searchTerm}
                            onRestore={(id) => handleAction(restoreTestimonial, id, 'testimonial', "Testimonial restored.")}
                            onDelete={(id) => handleAction(permanentlyDeleteTestimonial, id, 'testimonial', "Testimonial permanently deleted.")}
                            isPending={isPending}
                            />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
