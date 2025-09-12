'use client';

import { useActionState, useState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, XCircle, Camera } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { SiteSettings } from '@/lib/site-settings';
import { updateSiteSettings } from '@/lib/site-settings';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { cn } from '@/lib/utils';


interface ProfileFormProps {
    settings: SiteSettings;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
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
    
    const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setAvatarPreview(null);
        setAvatarRemoved(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setFileInputKey(Date.now());
    };
        
    return (
        <form action={formAction} className="space-y-8">
            <input type="hidden" name="username" defaultValue={settings.username} />
            <input type="hidden" name="logo" value={settings.logo} />
            <input type="hidden" name="avatarRemoved" value={avatarRemoved.toString()} />
            
            <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className='relative w-64 h-64 mx-auto group'>
                    <label htmlFor="avatar-upload" className={cn(
                        "relative group cursor-pointer w-full h-full rounded-full flex items-center justify-center bg-muted/50 overflow-hidden border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors",
                        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                    )}>
                        <div className="w-full h-full">
                            {avatarPreview ? (
                                <Image
                                    src={avatarPreview}
                                    alt="Avatar preview"
                                    width={256}
                                    height={256}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center text-muted-foreground p-2 w-full h-full flex items-center justify-center">
                                    <svg className="w-40 h-40 text-muted-foreground/30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="50" cy="50" r="50" fill="hsl(var(--muted-foreground)/0.1)"/>
                                        <path d="M50 42.5C54.1421 42.5 57.5 39.1421 57.5 35C57.5 30.8579 54.1421 27.5 50 27.5C45.8579 27.5 42.5 30.8579 42.5 35C42.5 39.1421 45.8579 42.5 50 42.5Z" stroke="hsl(var(--muted-foreground)/0.6)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M65.625 72.5C65.625 65.6528 60.2972 60 54.375 60H45.625C39.7028 60 34.375 65.6528 34.375 72.5" stroke="hsl(var(--muted-foreground)/0.6)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            )}
                        </div>

                         {/* Edit/Remove overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                            <Camera className="text-white h-10 w-10" />
                        </div>

                         {avatarPreview && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={handleRemoveImage}
                                aria-label="Remove image"
                            >
                                <XCircle className="h-5 w-5" />
                            </Button>
                        )}
                        
                    </label>
                    <Input 
                        key={fileInputKey} 
                        id="avatar-upload" 
                        name="avatarFile" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        className="sr-only" 
                        ref={fileInputRef}
                    />
                </div>
                <p className="text-sm text-center text-muted-foreground mt-4">
                    Click to upload a new profile picture. Max file size: ${MAX_FILE_SIZE_MB}MB.
                </p>
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