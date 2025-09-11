'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, AlertCircle } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { AboutContent } from '@/lib/about-content';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface AboutFormProps {
    action: (prevState: any, formData: FormData) => Promise<{
        message: string;
        error: string | null;
        success: boolean;
    }>;
    content: AboutContent;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full md:w-auto">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
        </Button>
    )
}

const MAX_FILE_SIZE_MB = 1;

export default function AboutForm({ content, action }: AboutFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(content?.image || null);
    const { toast } = useToast();
    
    const [state, formAction] = useActionState(action, { message: '', error: null, success: false });

    useEffect(() => {
        if (state.success && state.message) {
            toast({
                title: 'Success',
                description: state.message,
            });
        }
    }, [state, toast]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                toast({
                    title: 'File Too Large',
                    description: `Please upload an image smaller than ${MAX_FILE_SIZE_MB}MB.`,
                    variant: 'destructive'
                });
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                setImagePreview(dataUrl);
            };
            reader.readAsDataURL(file);
        }
    };
        
    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={content.title} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="paragraph1">First Paragraph</Label>
                <Textarea id="paragraph1" name="paragraph1" defaultValue={content.paragraph1} rows={5} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="paragraph2">Second Paragraph</Label>
                <Textarea id="paragraph2" name="paragraph2" defaultValue={content.paragraph2} rows={5} required />
            </div>
            <div className="space-y-4">
                <Label htmlFor="image-upload">Section Image</Label>
                <div className="flex items-center gap-4">
                    <div className="w-48 h-32 rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                        {imagePreview ? (
                            <Image src={imagePreview} alt="About section preview" width={192} height={128} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center text-muted-foreground text-sm p-2">
                                <Upload className="mx-auto h-6 w-6" />
                                <span>Preview</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <Input id="image-upload" name="imageFile" type="file" accept="image/*" onChange={handleImageChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        <p className="text-sm text-muted-foreground mt-2">
                        Upload an image for the about section. Max file size: ${MAX_FILE_SIZE_MB}MB.
                        </p>
                    </div>
                </div>
            </div>
            {state?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end">
                <SubmitButton />
            </div>
        </form>
    );
}