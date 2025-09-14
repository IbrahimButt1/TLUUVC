'use client';

import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { HeroImage } from "@/lib/hero-images";
import { Loader2, Upload, XCircle } from 'lucide-react';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';


interface HeroImageFormProps {
    action: (formData: FormData) => Promise<void>;
    image?: HeroImage;
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

const MAX_FILE_SIZE_MB = 1;

export default function HeroImageForm({ action, image, submitText }: HeroImageFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(image?.image || null);
    const [imageRemoved, setImageRemoved] = useState(false);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileInputKey, setFileInputKey] = useState(Date.now());


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp') {
                toast({
                    title: 'Invalid File Type',
                    description: 'Please upload a JPG, PNG, or WebP image.',
                    variant: 'destructive'
                });
                return;
            }
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
                setImageRemoved(false);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageRemoved(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setFileInputKey(Date.now());
    };
    
    return (
        <form action={action} className="space-y-6">
            {image && <input type="hidden" name="id" value={image.id} />}
            <input type="hidden" name="imageRemoved" value={imageRemoved.toString()} />
            <div className="space-y-2">
                <Label htmlFor="title">Image Title</Label>
                <Input id="title" name="title" defaultValue={image?.title} required placeholder="e.g. Your Gateway to Global Opportunities" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Image Description</Label>
                <Textarea id="description" name="description" defaultValue={image?.description} rows={3} required placeholder="e.g. Expert visa consultation..."/>
            </div>
             <div className="space-y-4">
                <Label htmlFor="image-upload">Hero Image</Label>
                <div className="flex items-center gap-4">
                    <div className="w-32 h-20 relative rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                        {imagePreview ? (
                           <>
                                <Image src={imagePreview} alt="Hero image preview" width={128} height={80} className="w-full h-full object-cover" />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 text-white bg-black/50 hover:bg-black/75 hover:text-white"
                                    onClick={handleRemoveImage}
                                >
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                             <div className="text-center text-muted-foreground text-sm p-2">
                                <Upload className="mx-auto h-6 w-6" />
                                <span>Preview</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <Input key={fileInputKey} id="image-upload" name="imageFile" type="file" accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        <p className="text-sm text-muted-foreground mt-2">
                            Upload a landscape image (e.g. 1920x1080). Max file size: ${MAX_FILE_SIZE_MB}MB.
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
