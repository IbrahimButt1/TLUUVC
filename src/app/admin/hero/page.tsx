import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getHeroImages } from "@/lib/hero-images";
import HeroImagesClient from "@/components/admin/hero-images-client";

export default async function ManageHeroImages() {
  const images = await getHeroImages();
  
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Manage Hero Images</h1>
            <Button asChild>
                <Link href="/admin/hero/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Image
                </Link>
            </Button>
        </div>
        <HeroImagesClient initialImages={images} />
    </div>
  );
}
