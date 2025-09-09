'use client';

import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Service } from "@/lib/services";
import { Loader2, University, Briefcase, Users, FileText, Landmark, Plane, Ship, Hotel, Home, Globe, Award, ThumbsUp, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as LucideIcons from "lucide-react";
import React from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface ServiceFormProps {
    action: (imageDataUri: string, formData: FormData) => Promise<void>;
    service?: Service;
    submitText: string;
}

const icons = [
    { name: 'University', icon: University },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Users', icon: Users },
    { name: 'FileText', icon: FileText },
    { name: 'Landmark', icon: Landmark },
    { name: 'Plane', icon: Plane },
    { name: 'Ship', icon: Ship },
    { name: 'Hotel', icon: Hotel },
    { name: 'Home', icon: Home },
    { name: 'Globe', icon: Globe },
    { name: 'Award', icon: Award },
    { name: 'ThumbsUp', icon: LucideIcons.ThumbsUp },
];

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

export default function ServiceForm({ action, service, submitText }: ServiceFormProps) {
    const [imagePreview, setImagePreview] = React.useState<string | null>(service?.image || null);
    const [imageDataUri, setImageDataUri] = React.useState("");
    const { toast } = useToast();

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
                setImageDataUri(dataUrl);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const formAction = action.bind(null, imageDataUri);

    return (
        <form action={formAction} className="space-y-6">
            {service && <input type="hidden" name="id" value={service.id} />}
            <div className="space-y-2">
                <Label htmlFor="title">Service Title</Label>
                <Input id="title" name="title" defaultValue={service?.title} required placeholder="e.g. Student Visas"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Short Description (for home page cards)</Label>
                <Textarea id="description" name="description" defaultValue={service?.description} rows={3} required placeholder="e.g. Comprehensive guidance for students aspiring to study abroad..."/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="longDescription">Long Description (for service detail page)</Label>
                <Textarea id="longDescription" name="longDescription" defaultValue={service?.longDescription} rows={6} placeholder="e.g. Navigating the student visa process can be complex. We provide expert, end-to-end guidance..."/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="requirements">Key Requirements (one per line)</Label>
                <Textarea 
                    id="requirements" 
                    name="requirements" 
                    defaultValue={service?.requirements?.join('\n')} 
                    rows={6}
                    placeholder="e.g. Acceptance letter from a designated learning institution."
                />
            </div>
            <div className="space-y-4">
                <Label htmlFor="image-upload">Service Image</Label>
                <div className="flex items-center gap-4">
                    <div className="w-32 h-20 rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Service image preview" width={128} height={80} className="w-full h-full object-cover" />
                        ) : (
                             <div className="text-center text-muted-foreground text-sm p-2">
                                <Upload className="mx-auto h-6 w-6" />
                                <span>Preview</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <Input id="image-upload" name="imageFile" type="file" accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        <p className="text-sm text-muted-foreground mt-2">
                           Max file size: ${MAX_FILE_SIZE_MB}MB.
                        </p>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select name="icon" defaultValue={service?.icon}>
                    <SelectTrigger id="icon">
                        <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                        {icons.map(({name, icon: Icon}) => (
                            <SelectItem key={name} value={name}>
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    <span>{name}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/admin/services">Cancel</Link>
                </Button>
                <SubmitButton submitText={submitText} />
            </div>
        </form>
    );
}
