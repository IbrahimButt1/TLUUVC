'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { HeroImage } from '@/lib/hero-images';
import { useRef } from "react";

export default function Hero({ images }: { images: HeroImage[] }) {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  if (images.length === 0) {
    return (
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center bg-muted">
        <p className="text-muted-foreground">No hero images have been added yet.</p>
      </section>
    );
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{ loop: true }}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      className="w-full"
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
              <Image
                src={image.image}
                alt={image.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-primary/60" />
              <div className="relative z-10 p-4 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                  {image.title}
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}>
                  {image.description}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                    <a href="#contact">Book a Consultation</a>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <a href="#services">Our Services</a>
                  </Button>
                </div>
              </div>
            </section>
          </CarouselItem>
        ))}
      </CarouselContent>
       <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <CarouselPrevious className="static -translate-y-0" />
            <CarouselNext className="static -translate-y-0" />
       </div>
    </Carousel>
  );
}
