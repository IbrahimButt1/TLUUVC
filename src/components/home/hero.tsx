import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
      <Image
        src="https://picsum.photos/1920/1080"
        alt="International city skyline at dusk"
        data-ai-hint="city skyline"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-primary/60" />
      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
          Your Gateway to Global Opportunities
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}>
          Expert visa consultation to help you navigate your journey abroad with confidence and ease.
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
  );
}
