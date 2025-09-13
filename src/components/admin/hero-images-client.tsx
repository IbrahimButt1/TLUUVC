'use client';

import { useState, useMemo } from 'react';
import type { HeroImage } from '@/lib/hero-images';
import HeroImagesList from './hero-images-list';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import PaginationControls from '@/components/admin/pagination-controls';

const ITEMS_PER_PAGE = 6;

export default function HeroImagesClient({ initialImages }: { initialImages: HeroImage[] }) {
  const [images, setImages] = useState(initialImages);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredImages = useMemo(() => {
    if (!searchTerm) {
      return images;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return images.filter(image =>
      image.title.toLowerCase().includes(lowercasedTerm) ||
      image.description.toLowerCase().includes(lowercasedTerm)
    );
  }, [images, searchTerm]);

  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
  const paginatedImages = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredImages.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredImages, currentPage]);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-end px-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search images..."
              className="w-full md:w-80 bg-background"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
      </div>
      
      <HeroImagesList images={paginatedImages} />

      {totalPages > 1 && (
        <div className="mt-6">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/hero"
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
