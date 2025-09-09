'use client';

import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { SiteSettings } from "@/lib/site-settings";
import { Loader2, Upload } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface SettingsFormProps {
    action: (logoDataUri: string, formData: FormData) => Promise<void>;
    settings: SiteSettings;
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

const MAX_SIZE_KB = 300;

export default function SettingsForm({ action, settings, submitText }: SettingsFormProps) {
    const [logoPreview, setLogoPreview] = React.useState<string | null>(settings.logo || null);
    const [logoDataUri, setLogoDataUri] = React.useState("");
    const { toast } = useToast();

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new window.Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                     const dataUrl = event.target?.result as string;
                    if (file.size > MAX_SIZE_KB * 1024) {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const MAX_WIDTH = 800;
                        const MAX_HEIGHT = 800;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        ctx!.drawImage(img, 0, 0, width, height);
                        
                        const compressedDataUrl = canvas.toDataURL(file.type, 0.7);
                        setLogoPreview(compressedDataUrl);
                        setLogoDataUri(compressedDataUrl);
                        toast({
                            title: 'Image Compressed',
                            description: `The uploaded image was larger than ${MAX_SIZE_KB}KB and has been automatically compressed.`
                        });
                    } else {
                         setLogoPreview(dataUrl);
                         setLogoDataUri(dataUrl);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const formAction = action.bind(null, logoDataUri);

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-4">
                <Label htmlFor="logo-upload">Website Logo</Label>
                <div className="flex items-center gap-4">
                     <div className="w-24 h-24 rounded-full border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                        {logoPreview ? (
                            <Image src={logoPreview} alt="Logo preview" width={96} height={96} className="w-full h-full object-cover" />
                        ) : (
                             <div className="text-center text-muted-foreground text-sm p-2">
                                <Upload className="mx-auto h-6 w-6" />
                                <span>Preview</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <Input id="logo-upload" type="file" accept="image/jpeg, image/png" onChange={handleLogoChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        <p className="text-sm text-muted-foreground mt-2">
                           Upload your site logo. A square image works best. Images over ${MAX_SIZE_KB}KB will be compressed.
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/admin">Cancel</Link>
                </Button>
                <SubmitButton submitText={submitText} />
            </div>
        </form>
    );
}
