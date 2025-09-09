'use client';

import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Testimonial } from "@/lib/testimonials";
import { Loader2 } from 'lucide-react';

interface TestimonialFormProps {
    action: (formData: FormData) => Promise<void>;
    testimonial?: Testimonial;
    submitText: string;
}

function SubmitButton({ submitText }: { submitText: string }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitText}
        </Button>
    )
}

export default function TestimonialForm({ action, testimonial, submitText }: TestimonialFormProps) {
    return (
        <form action={action} className="space-y-6">
            {testimonial && <input type="hidden" name="id" value={testimonial.id} />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Client Name</Label>
                    <Input id="name" name="name" defaultValue={testimonial?.name} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="destination">Destination / Role</Label>
                    <Input id="destination" name="destination" placeholder="e.g., Student in Canada" defaultValue={testimonial?.destination} required />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" placeholder="https://picsum.photos/100/100" defaultValue={testimonial?.image} required />
                 <p className="text-sm text-muted-foreground">
                    Use a service like <a href="https://picsum.photos/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">picsum.photos</a> or upload an image and paste the URL here.
                </p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="testimonial">Testimonial</Label>
                <Textarea id="testimonial" name="testimonial" defaultValue={testimonial?.testimonial} rows={5} required />
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/admin/testimonials">Cancel</Link>
                </Button>
                <SubmitButton submitText={submitText} />
            </div>
        </form>
    );
}
