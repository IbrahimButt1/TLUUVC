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

interface SettingsFormProps {
    action: (imageDataUri: string, formData: FormData) => Promise<void>;
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

export default function SettingsForm({ action, settings, submitText }: SettingsFormProps) {
    const [logoPreview, setLogoPreview] = React.useState<string | null>(settings.logo || null);
    const [logoDataUri, setLogoDataUri] = React.useState(settings.logo || "");

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUri = reader.result as string;
                setLogoPreview(dataUri);
                setLogoDataUri(dataUri);
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
                        <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        <p className="text-sm text-muted-foreground mt-2">
                           Upload your site logo. A square image works best.
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
