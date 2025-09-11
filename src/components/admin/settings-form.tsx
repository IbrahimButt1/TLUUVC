'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, Upload, Eye, EyeOff, AlertCircle } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { SiteSettings, UpdateSettingsState } from '@/lib/site-settings';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface SettingsFormProps {
    action: (prevState: UpdateSettingsState, formData: FormData) => Promise<UpdateSettingsState>;
    settings: SiteSettings;
    submitText: string;
}

function SubmitButton({ submitText }: { submitText: string }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full md:w-auto">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitText}
        </Button>
    )
}

const MAX_FILE_SIZE_MB = 1;

export default function SettingsForm({ action, settings, submitText }: SettingsFormProps) {
    const [logoPreview, setLogoPreview] = React.useState<string | null>(settings?.logo || null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { toast } = useToast();

    const [state, formAction] = useActionState(action, { message: '', error: null, success: false });

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
            };
            reader.readAsDataURL(file);
        }
    };
        
    return (
        <form action={formAction} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Branding</CardTitle>
                    <CardDescription>Update your company's logo.</CardDescription>
                </CardHeader>
                <CardContent>
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
                                <Input id="logo-upload" name="logoFile" type="file" accept="image/*" onChange={handleLogoChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                                <p className="text-sm text-muted-foreground mt-2">
                                Upload your company logo. Max file size: ${MAX_FILE_SIZE_MB}MB.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Admin Credentials</CardTitle>
                    <CardDescription>Manage administrator username and password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" name="username" defaultValue={settings.username} required />
                    </div>
                    <Separator />
                     <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                            <Input id="currentPassword" name="currentPassword" type={showCurrentPassword ? "text" : "password"} placeholder="Enter your current password to make changes" />
                            <button 
                                type="button" 
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                                {showCurrentPassword ? <Eye className="h-5 w-5 text-gray-500" /> : <EyeOff className="h-5 w-5 text-gray-500" />}
                            </button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                            <Input id="newPassword" name="newPassword" type={showNewPassword ? "text" : "password"} placeholder="Leave blank to keep current password" />
                            <button 
                                type="button" 
                                onClick={() => setShowNewPassword(!showNewPassword)} 
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                                {showNewPassword ? <Eye className="h-5 w-5 text-gray-500" /> : <EyeOff className="h-5 w-5 text-gray-500" />}
                            </button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                            <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your new password" />
                             <button 
                                type="button" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                                {showConfirmPassword ? <Eye className="h-5 w-5 text-gray-500" /> : <EyeOff className="h-5 w-5 text-gray-500" />}
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {state?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/admin">Cancel</Link>
                </Button>
                <SubmitButton submitText={submitText} />
            </div>
        </form>
    );
}
