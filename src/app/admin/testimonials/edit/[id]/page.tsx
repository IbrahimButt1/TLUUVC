import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getTestimonialById, updateTestimonial } from "@/lib/testimonials";
import { notFound } from "next/navigation";
import TestimonialForm from "@/components/admin/testimonial-form";

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
    const testimonial = await getTestimonialById(params.id);
    if (!testimonial) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Testimonial</CardTitle>
                    <CardDescription>Update the details for the testimonial below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <TestimonialForm
                        testimonial={testimonial}
                        action={updateTestimonial}
                        submitText="Save Changes"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
