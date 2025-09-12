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

interface ProfileFormProps {
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

export default function ProfileForm({ settings }: ProfileFormProps) {
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(settings?.avatar || null);
    const [avatarRemoved, setAvatarRemoved] = useState(false);
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

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                setAvatarPreview(dataUrl);
                setAvatarRemoved(false);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemoveImage = () => {
        setAvatarPreview(null);
        setAvatarRemoved(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setFileInputKey(Date.now());
    };
        
    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="username" defaultValue={settings.username} />
            <input type="hidden" name="logo" value={settings.logo} />
            <input type="hidden" name="avatarRemoved" value={avatarRemoved.toString()} />
            <div className="space-y-4">
                <Label htmlFor="avatar-upload">Profile Picture</Label>
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 relative rounded-full border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                        {avatarPreview ? (
                            <>
                                <Image src={avatarPreview} alt="Avatar preview" width={96} height={96} className="w-full h-full object-cover" />
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
                                <Upload className="mx-auto h-8 w-8" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <Input key={fileInputKey} id="avatar-upload" name="avatarFile" type="file" accept="image/*" onChange={handleAvatarChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        <p className="text-sm text-muted-foreground mt-2">
                        Upload a new profile picture. Max file size: ${MAX_FILE_SIZE_MB}MB.
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
