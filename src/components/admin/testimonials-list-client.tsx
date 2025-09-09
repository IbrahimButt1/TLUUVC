'use client';

import { useState, useMemo } from 'react';
import type { Testimonial } from '@/lib/testimonials';
import TestimonialsList from './testimonials-list';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function TestimonialsListClient({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTestimonials = useMemo(() => {
    if (!searchTerm) {
      return testimonials;
    }
    return testimonials.filter(testimonial =>
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.testimonial.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [testimonials, searchTerm]);

  return (
    <div>
       <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
            type="search"
            placeholder="Search testimonials..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <TestimonialsList testimonials={filteredTestimonials} searchTerm={searchTerm} />
    </div>
  );
}
