
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/home/hero';
import Services from '@/components/home/services';
import About from '@/components/home/about';
import Testimonials from '@/components/home/testimonials';
import KnowledgeBase from '@/components/home/knowledge-base';
import Contact from '@/components/home/contact';
import { getHeroImages } from '@/lib/hero-images';
import { getSiteSettings } from '@/lib/site-settings';

export default async function Home() {
  const heroImages = await getHeroImages();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero images={heroImages} />
        <Services />
        <About />
        <KnowledgeBase />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
