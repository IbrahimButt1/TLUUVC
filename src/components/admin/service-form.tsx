'use client';

import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Service } from "@/lib/services";
import { Loader2, University, Briefcase, Users, FileText, Landmark, Plane, Ship, Hotel, Home, Globe, Award, ThumbsUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as LucideIcons from "lucide-react";

interface ServiceFormProps {
    action: (formData: FormData) => Promise<void>;
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

export default function ServiceForm({ action, service, submitText }: ServiceFormProps) {
    return (
        <form action={action} className="space-y-6">
            {service && <input type="hidden" name="id" value={service.id} />}
            <div className="space-y-2">
                <Label htmlFor="title">Service Title</Label>
                <Input id="title" name="title" defaultValue={service?.title} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Service Description</Label>
                <Textarea id="description" name="description" defaultValue={service?.description} rows={5} required />
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
                 <p className="text-sm text-muted-foreground">
                    Choose an icon that best represents the service. More can be found at <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Lucide Icons</a>.
                </p>
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
