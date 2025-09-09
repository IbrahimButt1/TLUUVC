'use client';

import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { HeroImage } from "@/lib/hero-images";
import { Loader2, Upload } from 'lucide-react';
import React from 'react';
import Image from 'next/image';

interface HeroImageFormProps {
    action: (formData: FormData) => Promise<void>;
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

export default function HeroImageForm({ action, submitText }: HeroImageFormProps) {
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [imageDataUri, setImageDataUri] = React.useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUri = reader.result as string;
                setImagePreview(dataUri);
                setImageDataUri(dataUri);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <form action={action} className="space-y-6">
            <input type="hidden" name="image" value={imageDataUri} />

            <div className="space-y-2">
                <Label htmlFor="title">Image Title</Label>
                <Input id="title" name="title" required placeholder="e.g. Your Gateway to Global Opportunities" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Image Description</Label>
                <Textarea id="description" name="description" rows={3} required placeholder="e.g. Expert visa consultation..."/>
            </div>
             <div className="space-y-4">
                <Label htmlFor="image-upload">Hero Image</Label>
                <div className="flex items-center gap-4">
                    <div className="w-32 h-20 rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Hero image preview" width={128} height={80} className="w-full h-full object-cover" />
                        ) : (
                             <div className="text-center text-muted-foreground text-sm p-2">
                                <Upload className="mx-auto h-6 w-6" />
                                <span>Preview</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <Input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        <p className="text-sm text-muted-foreground mt-2">
                            Upload a landscape image (e.g. 1920x1080).
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/admin/hero">Cancel</Link>
                </Button>
                <SubmitButton submitText={submitText} />
            </div>
        </form>
    );
}
