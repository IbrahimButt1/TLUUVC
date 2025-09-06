import Image from 'next/image';

export default function About() {
  return (
    <section id="about" className="py-12 md:py-24 bg-secondary">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src="https://picsum.photos/600/700"
              alt="Professional consultant in a modern office"
              data-ai-hint="professional portrait"
              width={600}
              height={700}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold">About The LUU Visa Consultant</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              With over a decade of dedicated experience in immigration and visa consultation, The LUU Visa Consultant stands as a beacon of trust and expertise. We believe in turning your dreams of living, working, or studying abroad into reality.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              Our approach is personal and meticulous. We understand that every case is unique, and we provide tailored advice to navigate the complexities of visa applications. Our commitment is to your success, ensuring a smooth and transparent process from start to finish. We pride ourselves on our high success rate and the lasting relationships we build with our clients.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
