import Image from 'next/image';
import { getAboutContent } from '@/lib/about-content';

export default async function About() {
  const content = await getAboutContent();
  return (
    <section id="about" className="py-12 md:py-24 bg-secondary">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src={content.image || "https://picsum.photos/600/700"}
              alt="Professional consultant in a modern office"
              data-ai-hint="professional portrait"
              width={600}
              height={700}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold">{content.title}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {content.paragraph1}
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              {content.paragraph2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
