import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getTestimonials } from "@/lib/testimonials";
import TestimonialsListClient from "@/components/admin/testimonials-list-client";

export default async function ManageTestimonials() {
  const testimonials = await getTestimonials();
  return (
    <div>
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Manage Testimonials</h1>
            <Button asChild>
                <Link href="/admin/testimonials/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Testimonial
                </Link>
            </Button>
        </div>

        <TestimonialsListClient initialTestimonials={testimonials} />
    </div>
  );
}
