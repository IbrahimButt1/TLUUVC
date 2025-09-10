'use client';

import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, Upload } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { SiteSettings } from '@/lib/site-settings';

interface SettingsFormProps {
    action: (formData: FormData) => Promise<void>;
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

const MAX_FILE_SIZE_MB = 1;

export default function SettingsForm({ action, settings, submitText }: SettingsFormProps) {
    const [logoPreview, setLogoPreview] = React.useState<string | null>(settings?.logo || null);
    const [logoDataUri, setLogoDataUri] = React.useState("");
    const { toast } = useToast();

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                setLogoPreview(dataUrl);
                setLogoDataUri(dataUrl);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const formAction = action;
    
    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="logo" value={logoDataUri} />
            <div className="space-y-4">
                <Label htmlFor="logo-upload">Company Logo</Label>
                <div className="flex items-center gap-4">
                    <div className="w-32 h-16 rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                        {logoPreview ? (
                            <Image src={logoPreview} alt="Logo preview" width={128} height={64} className="w-full h-full object-contain" />
                        ) : (
                             <div className="text-center text-muted-foreground text-sm p-2">
                                <Upload className="mx-auto h-6 w-6" />
                                <span>Preview</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <Input id="logo-upload" name="imageFile" type="file" accept="image/*" onChange={handleLogoChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        <p className="text-sm text-muted-foreground mt-2">
                           Upload your company logo. Max file size: ${MAX_FILE_SIZE_MB}MB.
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
