import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import TestimonialForm from "@/components/admin/testimonial-form";
import { addTestimonial } from "@/lib/testimonials";

export default function NewTestimonialPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Testimonial</CardTitle>
                    <CardDescription>Fill out the form below to add a new success story to your website.</CardDescription>
                </CardHeader>
                <CardContent>
                    <TestimonialForm action={addTestimonial} submitText="Save Testimonial" />
                </CardContent>
            </Card>
        </div>
    );
}
