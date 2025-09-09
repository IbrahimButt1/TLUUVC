import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getHeroImages } from "@/lib/hero-images";
import HeroImagesList from "@/components/admin/hero-images-list";

export default async function ManageHeroImages() {
  const images = await getHeroImages();
  return (
    <div>
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Manage Hero Images</h1>
            <Button asChild>
                <Link href="/admin/hero/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Image
                </Link>
            </Button>
        </div>
        <HeroImagesList images={images} />
    </div>
  );
}
