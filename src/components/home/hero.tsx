'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { HeroImage } from '@/lib/hero-images';
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from '@/lib/utils';


export default function Hero({ images }: { images: HeroImage[] }) {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);


  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])


  if (images.length === 0) {
    return (
      <section id="hero" className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center bg-muted">
        <p className="text-muted-foreground">No hero images have been added yet.</p>
      </section>
    );
  }

  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin.current]}
      opts={{ loop: true }}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      className="w-full"
      id="hero"
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
       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
            <CarouselPrevious className="static -translate-y-0 text-white bg-black/20 hover:bg-black/40 hover:text-white border-white/50" />
            <div className="flex items-center justify-center gap-2">
                {Array.from({ length: count }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        className={cn(
                            "h-2 w-2 rounded-full transition-all",
                            current === i ? "bg-white w-4" : "bg-white/50 hover:bg-white/75"
                        )}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
            <CarouselNext className="static -translate-y-0 text-white bg-black/20 hover:bg-black/40 hover:text-white border-white/50" />
       </div>
    </Carousel>
  );
}
