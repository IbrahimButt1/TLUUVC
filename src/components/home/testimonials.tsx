'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTestimonials, type Testimonial } from "@/lib/testimonials";
import { useEffect, useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";


export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  useEffect(() => {
    getTestimonials().then(setTestimonials);
  }, []);

  if (testimonials.length === 0) {
    return null; // Or a loading skeleton
  }

  return (
    <section id="testimonials" className="py-12 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Success Stories</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Hear from our clients who have successfully embarked on their new journeys.</p>
        </div>
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((t, index) => (
              <CarouselItem key={index} className="md:basis-1/2">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col">
                    <CardContent className="flex flex-col items-center text-center justify-center p-6 flex-grow">
                      <p className="text-muted-foreground italic mb-6">"{t.testimonial}"</p>
                      <div className="mt-auto flex items-center">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={t.image} alt={t.name} data-ai-hint="person portrait" />
                          <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 text-left">
                          <p className="font-semibold font-headline">{t.name}</p>
                          <p className="text-sm text-muted-foreground">{t.destination}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
