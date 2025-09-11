'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import type { SiteSettings, UpdateSettingsState } from '@/lib/site-settings';
import { updateSiteSettings } from '@/lib/site-settings';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface CredentialsFormProps {
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

export default function CredentialsForm({ settings }: CredentialsFormProps) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { toast } = useToast();

    const [state, formAction] = useActionState(updateSiteSettings, { message: '', error: null, success: false });

     React.useEffect(() => {
        if (state.success && state.message) {
            toast({
                title: 'Settings Saved',
                description: state.message,
            });
            // Clear password fields
            const form = document.querySelector('form');
            if (form) {
                const currentPasswordInput = form.elements.namedItem('currentPassword') as HTMLInputElement;
                const newPasswordInput = form.elements.namedItem('newPassword') as HTMLInputElement;
                const confirmPasswordInput = form.elements.namedItem('confirmPassword') as HTMLInputElement;
                if(currentPasswordInput) currentPasswordInput.value = '';
                if(newPasswordInput) newPasswordInput.value = '';
                if(confirmPasswordInput) confirmPasswordInput.value = '';
            }
        }
    }, [state, toast]);
        
    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="logo" value={settings.logo} />
             <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" defaultValue={settings.username} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                    <Input id="currentPassword" name="currentPassword" type={showCurrentPassword ? "text" : "password"} placeholder="Enter current password to make changes" />
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
