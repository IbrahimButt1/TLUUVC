"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { authenticate } from '@/lib/auth';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}

export default function LoginForm() {
  const [errorMessage, formAction] = useActionState(authenticate, undefined);
  const [showPassword, setShowPassword] = useState(false);

  const handleForgotPassword = () => {
    alert("Please contact your administrator at 'theluuvisaconsultant@gmail.com' to reset your password.");
  }

  return (
    <form action={formAction} className="grid gap-6">
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="username">User Name</Label>
                <Input
                    id="username"
                    type="text"
                    name="username"
                    placeholder="your-username"
                    required
                />
            </div>
            <div className="grid gap-2">
                 <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <button 
                        type="button"
                        onClick={handleForgotPassword}
                        className="ml-auto inline-block text-sm underline"
                    >
                        Forgot Password?
                    </button>
                </div>
                <div className="relative">
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} required placeholder="••••••••" />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-muted-foreground"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>
            <SubmitButton />
             {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
        </div>
    </form>
  )
}
