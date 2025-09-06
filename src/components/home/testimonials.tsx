import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Alex Johnson",
    image: "https://picsum.photos/100/100?random=1",
    destination: "Student in Canada",
    testimonial: "The process was seamless and stress-free. The team's expertise was evident from day one. I'm now studying my dream course in Toronto, all thanks to them!"
  },
  {
    name: "Maria Garcia",
    image: "https://picsum.photos/100/100?random=2",
    destination: "Skilled Worker in Australia",
    testimonial: "I can't thank them enough. They handled my complex work visa case with utmost professionalism and secured my visa faster than I expected. Highly recommended!"
  },
  {
    name: "Chen Wei",
    image: "https://picsum.photos/100/100?random=3",
    destination: "Family Reunion in the UK",
    testimonial: "Reuniting with my family was my biggest dream. The LUU Visa Consultant made it possible with their patient and thorough guidance. They are true experts."
  },
  {
    name: "Priya Patel",
    image: "https://picsum.photos/100/100?random=4",
    destination: "Tech Professional in Germany",
    testimonial: "Navigating the German visa system was daunting, but their clear instructions and support were invaluable. I landed my tech job and visa without any hiccups."
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-12 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Success Stories</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Hear from our clients who have successfully embarked on their new journeys.</p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
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
