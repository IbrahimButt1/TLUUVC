'use client';

import { useActionState, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, AlertCircle, XCircle } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { SiteSettings, UpdateSettingsState } from '@/lib/site-settings';
import { updateSiteSettings } from '@/lib/site-settings';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface BrandingFormProps {
    settings: SiteSettings;
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

export default function BrandingForm({ settings }: BrandingFormProps) {
    const [logoPreview, setLogoPreview] = React.useState<string | null>(settings?.logo || null);
    const [logoRemoved, setLogoRemoved] = useState(false);
    const { toast } = useToast();
    const [state, formAction] = useActionState(updateSiteSettings, { message: '', error: null, success: false });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileInputKey, setFileInputKey] = useState(Date.now());


     React.useEffect(() => {
        if (state.success && state.message) {
            toast({
                title: 'Settings Saved',
                description: state.message,
            });
        }
    }, [state, toast]);

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
                setLogoRemoved(false);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemoveImage = () => {
        setLogoPreview(null);
        setLogoRemoved(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setFileInputKey(Date.now());
    };
        
    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="username" defaultValue={settings.username} />
            <input type="hidden" name="logoRemoved" value={logoRemoved.toString()} />
            <div className="space-y-4">
                <Label htmlFor="logo-upload">Company Logo</Label>
                <div className="flex items-center gap-4">
                    <div className="w-32 h-16 relative rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                        {logoPreview ? (
                            <>
                                <Image src={logoPreview} alt="Logo preview" width={128} height={64} className="w-full h-full object-contain" />
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
                        <Input key={fileInputKey} id="logo-upload" name="logoFile" type="file" accept="image/*" onChange={handleLogoChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        <p className="text-sm text-muted-foreground mt-2">
                        Upload your company logo. Max file size: ${MAX_FILE_SIZE_MB}MB.
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
