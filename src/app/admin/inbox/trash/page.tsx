import TrashClient from "@/components/admin/trash-client";
import { getTrashedEmails } from "@/lib/emails";
import { getTrashedHeroImages } from "@/lib/hero-images";
import { getTrashedServices } from "@/lib/services";
import { getTrashedTestimonials } from "@/lib/testimonials";

export default async function TrashPage() {
    const initialEmails = await getTrashedEmails();
    const initialHeroImages = await getTrashedHeroImages();
    const initialServices = await getTrashedServices();
    const initialTestimonials = await getTrashedTestimonials();

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Trash</h1>
            </div>
            <div className="flex-grow">
              <TrashClient 
                initialEmails={initialEmails}
                initialHeroImages={initialHeroImages}
                initialServices={initialServices}
                initialTestimonials={initialTestimonials}
               />
            </div>
        </div>
    );
}
