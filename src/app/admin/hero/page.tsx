import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getPaginatedHeroImages } from "@/lib/hero-images";
import HeroImagesList from "@/components/admin/hero-images-list";
import PaginationControls from "@/components/admin/pagination-controls";

const ITEMS_PER_PAGE = 6;

export default async function ManageHeroImages({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const { images, totalCount } = await getPaginatedHeroImages(page, ITEMS_PER_PAGE);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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
        <div className="mt-6">
            <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                basePath="/admin/hero"
            />
        </div>
    </div>
  );
}
